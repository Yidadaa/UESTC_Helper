/**
 * @file Service模块，用于网页数据的获取与解析
 * @param {String} url 请求目的网页的URL
 * @param {Function} parser 网页解析函数，此函数接受一个网页，返回从网页中解析的数据
 * @return {Object} 各种方法
 */
const request = require('./request');
const message = require('antd/lib/message');

async function parsePage(url) {
    const res = await request(url);
    if (res === undefined || res.status === 500) {
        message.error('土豆服务器又抽风了！一会儿刷新看看吧～');
    } else {
        const text = await res.text();
        return text;
    }
}

module.exports = {
    parsePage
};