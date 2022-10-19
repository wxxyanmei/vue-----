/*
 * @Author: wxxyanmei 736692897@qq.com
 * @Date: 2022-10-19 22:03:06
 * @LastEditors: wxxyanmei 736692897@qq.com
 * @LastEditTime: 2022-10-19 22:04:41
 * @FilePath: \vue设计与实现\第三章-组件-函数表达.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const MyComponent = function() {
    return {
        tag: 'div',
        props: {
            onClick: () => {console.log('hello')}
        },
        children: 'Click Me'
    }
}