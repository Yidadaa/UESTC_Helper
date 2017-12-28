/**
 * @file 后台脚本
 * @desc 用来处理跨域消息的转发
 */
const REQUEST = 'request';
const RESPONSE = 'response';
let responsePorts = {}; // 保存所有的响应端口
let requestPorts = {}; // 保存所有的请求端口

let unhandledRequests = []; // 未处理的请求

/**
 * 响应各方面的请求
 * @param {*Object} port 
 * @desc 在开发模式下，后台会有三条连接加入，其中两条来自跨域脚本，
 *       另外一条来自前端页面。后台主要负责将前端页面发出的请求，
 *       转发到跨域脚本，并由跨域脚本执行跨域请求，然后将请求的结果
 *       返回给前端页面。
 */
function onConnect(port) {
  const info = JSON.parse(port.name);
  if (info.name === 'proxy') {
    responsePorts[info.href] = port;
    console.log('来自跨域脚本的连接已建立', info.href);
  } else if (info.name === 'client') {
    requestPorts[info.href] = port;
    console.log('来自客户端的连接已建立', info.href);
  }

  if (unhandledRequests.length > 0) {
    // 将未处理完成的请求序列处理完
    unhandledRequests.forEach(handle);
    unhandledRequests = [];
  }

  port.onMessage.addListener(handle);

  port.onDisconnect.addListener(function () {
    // 端口关闭时，自动讲对应的端口删除
    if (info.name === 'proxy') {
      delete responsePorts[info.href];
    } else if (info.name === 'client') {
      delete requestPorts[info.href]
    }
  });
}
chrome.runtime.onConnect.addListener(onConnect); // 接收来自内容脚本的连接
chrome.runtime.onConnectExternal.addListener(onConnect) // 接收来自网页端的连接

/**
 * 解析host
 */
function getHost(url) {
  const link = document.createElement('a');
  link.href = url;
  return link.host;
}

/**
 * 处理请求
 * @param {Object} params 
 */
function handle(params) {
  const {from, to} = params;
  if (params.type === REQUEST) {
    // 后台收到一个请求，将其转发给所有的跨域脚本
    const port = responsePorts[to];
    if (port) {
      port.postMessage(params);
    } else { // 当端口不可用时，先将请求缓存至请求序列
      unhandledRequests.push(params);
    }
  } else if (params.type === RESPONSE) {
    // 后台收到跨域脚本返回的响应，将其转发回请求端
    const {id, data} = params;
    const port = requestPorts[to];
    if (port) {
      port.postMessage({id, data});
    } else {　// 当端口不可用时，先将请求缓存至请求序列
      unhandledRequests.push(params);
    }
  }
}