/**
 * @file Service模块，用于网页数据的获取与解析
 * @param {String} url 请求目的网页的URL
 * @param {Function} parser 网页解析函数，此函数接受一个网页，返回从网页中解析的数据
 * @return {Object} 各种方法
 */
const request = require('./request');

const parsePage = (url, parser) => {
    return new Promise((resolve, reject) => {
        request(url).then((res) => {
            if(typeof(parser) === 'function') {
                resolve(parser(res));
            } else {
                reject('无效的parser，请指定一个解析函数');
            }
        });
    });
};

module.exports = {
    parsePage
};