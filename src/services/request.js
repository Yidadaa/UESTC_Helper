/**
 * @file 请求模块
 * @desc 用于发送跨域请求，获取指定网页的内容，发出的请求会被dev-server代理到另一个专门用来发请求的服务器上
 * @param {String} url 请求的URL
 * @return {Object} Promise对象
 */

module.exports = (url) => {
    !url.match(/^https?/) ? url = 'http://' + url : null; // 默认为url添加http前缀
    if (window.location.hostname === 'localhost') {
        // 判断是否在开发环境下
        url = `/url?url=${url}`;
    }
    return fetch(url).catch(e => e);
};