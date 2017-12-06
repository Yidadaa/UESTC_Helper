/**
 * @file Service模块，用于网页数据的获取与解析
 * @param {String} url 请求目的网页的URL
 * @param {Function} parser 网页解析函数，此函数接受一个网页，返回从网页中解析的数据
 * @return {Object} 各种方法
 */
const request = require('./request');
const message = require('antd/lib/message');

let cache = {}; // 用来缓存请求
async function sendRequest(url) {
  if (url in cache) {
    // 直接返回缓存的请求，提高性能
    return cache[url];
  } else {
    let res = null;
    try {
      res = await request(url);
    } catch (e) {
      message.error('请求出错，请稍后重试');
      console.error(e);
    }
    return res;
  }
}

module.exports = {
  sendRequest
};