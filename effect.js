/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-20 21:52:21
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-20 21:58:35
 * @FilePath: \vue设计与实现\effect.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//其他函数也可以影响body的内容
function effect() {
    document.body.innerText = 'hello word'
}

//影响了全局变量
let val = 1
function effect1 () {
    val = 2
}


