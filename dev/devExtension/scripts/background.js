/**
 * @file 后台脚本
 * @desc 用来处理跨域消息的转发
 */
const REQUEST = 'request';
const RESPONSE = 'response';
let responsePorts = []; // 保存所有的响应端口
let requestPorts = []; // 保存所有的请求端口
const RES_P_MAX = 1;
const REQ_Q_MAX = 1;
/**
 * 响应各方面的请求
 * @param {*Object} port 
 * @desc 在开发模式下，后台会有三条连接加入，其中两条来自跨域脚本，
 *       另外一条来自前端页面。后台主要负责将前端页面发出的请求，
 *       转发到跨域脚本，并由跨域脚本执行跨域请求，然后将请求的结果
 *       返回给前端页面。
 */
function onConnect(port) {
  if (port.name === 'proxy') {
    if (responsePorts.length >= RES_P_MAX) responsePorts = [];
    responsePorts.push(port);
    console.log('来自跨域脚本的连接已建立', responsePorts.length);
  } else if (port.name === 'client') {
    // TODO：使用更优雅的方法清理无效连接
    if (requestPorts.length >= REQ_Q_MAX) requestPorts = [];
    requestPorts.push(port);
    console.log('来自客户端的连接已建立', requestPorts.length);
  }

  port.onMessage.addListener(function (params) {
    if (params.type === REQUEST) {
      // 后台收到一个请求，将其转发给所有的跨域脚本
      responsePorts.forEach(port => port.postMessage(params));
    } else if (params.type === RESPONSE) {
      // 后台收到跨域脚本返回的响应，将其转发回请求端
      const {id, data} = params;
      requestPorts.forEach(port => port.postMessage({id, data}));
    }
  });
}
chrome.runtime.onConnect.addListener(onConnect); // 接收来自内容脚本的连接
chrome.runtime.onConnectExternal.addListener(onConnect) // 接收来自网页端的连接
