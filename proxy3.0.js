/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-21 23:01:10
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-22 15:57:36
 * @FilePath: \vue设计与实现\proxy.3.0.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let activeEffect;

const effect = (fn) => {
    function effectFn () {
        cleanup(effectFn)
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}

const bucket = new WeakMap()

const data = {
    ok: true,
    text: 'hello word'
}

//传入的effectFn函数中有个静态熟悉，deps。在track阶段，收集了触发这个副作用函数的代理对象值
//这是一个必须的操作，如果不cleanup代理对象get一次，track就会新增
const cleanup = (effectFn) => {
    //遍历effectFn.deps数组
    for(let i = 0; i < effectFn.deps.length; i++) {
        //deps是依赖集合
        const deps = effectFn.deps[i]
        //将effectFn从依赖集合中移除
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}

const track = (target, key) => {
    console.log('执行了收集依赖')
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
    activeEffect.deps.push(deps)
}

const trigger = (target, key) => {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    //这个操作是set特殊操作，避免set在循环时删除又新增元素时一直循环， Set.prototype.forEach
    //var s1 = new Set([1])
    //var s2 = new Set([3,4,5])
    //var s3 = new Set(s1) // set(1) {1} 当new Set时传入参数是Set类型，则s3的值与s1一样，区别在于在执行s1循环的时候同时使用了delete和add时，循环s3不会死循环，直接循环s1时会死循环
    const effectToRun = new Set(effects)
    effectToRun.forEach(effectFn => {
        console.log(effectFn)
        effectFn()
    })
    // effects && effects.forEach(fn => fn())
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
        document.body.innerText = obj.ok ? obj.text : 'not'
    }
)

setTimeout(() => {
    obj.text = 'hello vue3'
}, 1000)