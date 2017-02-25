const test = require('./components/test.jsx');
const ReactDOM = require('react-dom');
const React = require('react');

require('./style.less');

ReactDOM.render(React.createElement(test), document.querySelector('#app'));