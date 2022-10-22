/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-20 22:15:42
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-21 23:41:50
 * @FilePath: \vue设计与实现\proxy2.0.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//全局变量存储副作用函数
let activeEffect
//effect 函数用于注册副作用函数
function effect(fn) {
    const effectFn = () => {
        activeEffect = effectFn
        fn()
    }
    effectFn.deps = []
    effectFn()
}

const bucket = new Set()

const data = {
    text: 'hello word'
}

const obj = new Proxy(data, {
    get(target, key) {
        if (activeEffect) {
            bucket.add(activeEffect)
        }
        console.log(target)
        console.log(key)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        bucket.forEach(fn => fn())
        return true
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
}, 1000)
