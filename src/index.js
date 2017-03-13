/**
 * @file 主入口文件
 * @desc 此文件将挂载所有的内容到body里面
 */
const ReactDOM = require('react-dom');
const React = require('react');
const entry = require('./entry/layout');

require('antd/dist/antd.css');

require('./style.less');

ReactDOM.render(React.createElement(entry), document.body); 