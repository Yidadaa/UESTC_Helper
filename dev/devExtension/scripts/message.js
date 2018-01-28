/**
 * @file 用于跨域通讯，该脚本被挂载在iframe上
 * @desc 在开发模式下，该脚本将会被挂载到两个域，一个域是信息门户所在的域，
 *       一个是一卡通所在的域，如果后期功能扩增，将会被挂载到更多的域上，
 *       专门用来处理跨域请求。
 */
var info = JSON.stringify({
  name: 'proxy',
  href: location.host
});
var port = chrome.runtime.connect({name: info});
port.onMessage.addListener(function (msg) {
  // 如果请求的 url 与当前 iframe 不同域，那么不进行通讯
  console.debug(msg, document.cookie)

  // var semesterID = query(msg.url)['lesson.semester.id'];
  // if (semesterID) {
  //   document.cookie = 'semester.id=' + semesterID;
  // }

  if (isCORSHost(msg.url)) return;
  fetch(msg.url, {credentials: 'include'}).then(res => res.text()).then(res => {
    port.postMessage({
      id: msg.id,
      data: res,
      type: 'response',
      from: msg.to,
      to: msg.from
    });
  });
});
/**
 * 检查请求与当前域是否相同，若不同，返回false
 * @param {*String} url 
 * @return {*Boolean}
 */
function isCORSHost(url) {
  var curHost = location.host;
  var link = document.createElement('a');
  link.href = url;
  return link.host !== curHost;
}
/**
 * 解析URL中的查询字段
 * @param {*String} url 
 */
function query(url) {
  var curHost = location.host;
  var link = document.createElement('a');
  link.href = url;
  return link.search.replace('?', '').split('&').reduce(function (pre, cur) {
    var val = cur.split('=');
    return Object.assign({}, pre, {[val[0]]: val[1]});
  }, {});
};