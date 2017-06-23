/**
 * 工具方法，获取某个dom的实时style
 */
module.exports = (domName) => {
  return window.getComputedStyle(document.querySelector(domName));
};