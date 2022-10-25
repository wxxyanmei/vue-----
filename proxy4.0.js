/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-22 16:04:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-25 16:52:32
 * @FilePath: \vue设计与实现\proxy4.0.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 用一个全局变量存储当前激活的effect函数
let activeEffect
const bucket = new WeakMap()
const data = {
    ok: true,
    text: 'hello word'
}

const effectStack = [] //effect栈

function effect(fn) {
    const effectFn = () => {
        cleanup(effectFn)
        activeEffect = effectFn
        fn()
    }
    //activeEffect.deps[]来存储所有与改副作用函数相关的依赖集合
    effectFn.deps = []
    //执行副作用函数
    effectFn()
}

const obj = new Proxy(data, {
    get(target, key) {
        //收集依赖
        track(target, key)
        return target[key]
    },
    set(target, key, newValue) {
        //触发副作用函数
        target[key] = newValue
        trigger(target, key)
        
    }
})

//清空当前effect函数的依赖
const cleanUp = (effectFn) => {
    for (let i = 0; i < effectFn.deps; i++) {
        const deps = effectFn[i]
        deps.delete(effectFn)
    }
}

//收集依赖的函数
const track = (target, key) => {
    if (!activeEffect) return track[key]
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

//触发更新的函数
const trigger = (target, key) =>{
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    const effectToRun = new Set()
    effects && effects.forEach(effect => {
        if (effect !== activeEffect) {
            effectToRun.add(effect)
        }
    })
    effectToRun.forEach(effect => effect())
}