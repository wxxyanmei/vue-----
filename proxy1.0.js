/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-20 22:04:02
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-20 22:14:19
 * @FilePath: \vue设计与实现\proxy.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//副作用函数
function effect() {
    document.body.innerText = obj.text
}

//执行副作用函数，触发取值
effect()

//1秒后修改相应式的数据
setTimeout(() => {
    obj.text = "hello vue3"
})

// 存储副作用的函数桶
const bucket = new Set()

//原始数据
const data = {text: 'hello word'}

//对原始数据的代理
const obj = new Proxy(data, {
    //拦截操作
    get(target, key) {
        // 将副作用函数effect 添加到存储副作用函数的桶中
        bucket.add(effect)
        // 返回属性值
        return target[key]
    },
    //拦截设置操作
    set(target, key, newValue) {
        //设置属性值
        target[key] = newValue
        //把副作用函数从桶里取出来执行
        bucket.forEach(fn => fn())
        //返回true 代表设置操作成功
        return true
    }
})