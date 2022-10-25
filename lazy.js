/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-25 21:50:37
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-25 22:38:42
 * @FilePath: \vue设计与实现\lazy.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let activeEffect;
const bucket = new WeakMap()
const data = {
    ok: true,
    text: 'hello word',
    foo: 1,
    bar: 2
}

const effectStack = []

const cleanUp = (effectFn) => {
    for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn)
    }
    effectFn.deps.length = []
}

function effect (fn, options = {}) {
    const effectFn = () => {
        cleanUp(effectFn)
        activeEffect = effectFn
        effectStack.push(effectFn)
        const res = fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
    effectFn.deps = [];
    effectFn.options = options
    if (!options.Lazy) {
        effectFn()
    }
    return effectFn
}

const obj = new Proxy(data, {
    get(target, key) {
        track(target, key)
        return target[key]
    },
    set(target, key, newValue) {
        target[key] = newValue
        trigger(target, key)
    }
})

const track = (target, key) => {
    if (!activeEffect) return;
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target,(depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
}

const trigger = (target, key) => {
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    const effectToRun = new Set()
    effects && effects.forEach(effects => {
        if (effects !== activeEffect)
        effectToRun.add(effects)
    })
    effectToRun.forEach(effectFn => {
        effectFn()
        effectFn.options.scheduler && effectFn.options.scheduler()
    })

}

const effectFn = effect(
    () => {console.log(obj.ok)},
    {
        Lazy: true
    }
)

function computed (getter) {
    let value;
    let dirty = true
    const effectFn = effect(getter, {
        Lazy: true,
        scheduler() {
            if (!dirty) {
                dirty = true
                trigger(obj, 'value')
            }
            

        }
    })
    const obj = {
        get value() {
            if (dirty) {
                value = effectFn()
                dirty = false
            }
            track(obj, 'value')
            return value
        }
    }
    return obj
}

const sumRes = computed(() => {
    return obj.foo + obj.bar
})

console.log(sumRes.value)

function watch(source, cb) {
    effect(
        () => source.foo,
        {
            scheduler() {
                cb()
            }
        }
    )
}

watch(obj, () => {
    console.log('数据变化了')
})