const test = require('./components/test/index.jsx');
const ReactDOM = require('react-dom');
const React = require('react');

require('antd/dist/antd.css');

require('./style.less');

ReactDOM.render(React.createElement(test), document.querySelector('#app'));