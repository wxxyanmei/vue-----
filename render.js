/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-19 22:08:58
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-19 22:35:08
 * @FilePath: \vue设计与实现\render.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function renderer(vnode, container) {
    if (typeof vnode.tag === 'string') {
        // 说明vnode描述的是标签元素
        mountElement(vnode, container)
    } else if (typeof vnode.tag === 'function') {
        // 说明vnode 描述的是组件
        mountComponent(vnode, container)
    }
}

//标签元素渲染
function mountElement(vnode, container) {
    // 使用vnode.tag 作为标签名称创建DOM
    const el = document.createElement(vnode.tag)
    //遍历props，将属性，事件添加到DOM
    for (const key in vnode.props) {
        if (/^on/.test(key)) {
            el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key])
        }
    }
    //处理children
    if (typeof vnode.children === 'string') {
        el.appendChild(document.createTextNode(vnode.children))
    }else if (Array.isArray(vnode.children)) {
        vnode.children.forEach(child => {
            renderer(child, el)
        });
    }

    container.appendChild(el)
}

//组件渲染
function mountComponent(vnode, container) {
    //调用组件函数，获取组件需要渲染的内容（虚拟DOM）

    const subtree = typeof vnode.tag === 'function' ? vnode.tag() : vnode.render()
    renderer(subtree, container)
}