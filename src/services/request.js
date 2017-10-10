/**
 * @file 请求模块
 * @desc 用于发送跨域请求，获取指定网页的内容
 * @param {String} url 请求的URL
 * @return {Object} Promise对象
 */
const localDevExtensionID = 'mkmngfcgelcdiolnonnigjbcnkfacijk'; // 调试用插件ID
const isDevEnv = location.hostname === 'localhost' || location.hostname === '127.0.0.1'; // 判断是否是开发环境
const message = {name: 'client'};
const port = isDevEnv
    ? chrome.runtime.connect(localDevExtensionID, message)
    : chrome.runtime.connect(message);

/**
 * 对Chrome的通讯函数进行包装
 * @param {*String} url 
 */
const request = url => {
    return new Promise((resolve, reject) => {
        const params = {
            url,
            id: Math.random().toString(),
            type: 'request'
        };
        port.postMessage(params);
        port.onMessage.addListener(msg => {
            const {data, id} = msg;
            if (id === params.id) resolve(data); // 校验响应与请求是否一致
            if (msg.error) reject(msg);
        });
    });
};

export default request;