/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-21 23:01:10
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-21 23:21:54
 * @FilePath: \vue设计与实现\proxy.3.0.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let activeEffect;

const effect = (fn) => {
    activeEffect = fn
    fn()
}

const bucket = new WeakMap()

const data = {
    text: 'hello word'
}

const track = (target, key) => {
    if (!activeEffect) return target[key];
    //获取代理对象的key值副作用依赖函数的map
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

const trigger = (target, key, newValue) => {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        trigger(target, key, newValue)
    }
})

effect(
    () => {
        console.log('effect run')
        console.log(obj)
        document.body.innerText = obj.text
    }
)

setTimeout(() => {
    obj.netExist = 'hello vue3'
    console.log(bucket)
}, 1000)