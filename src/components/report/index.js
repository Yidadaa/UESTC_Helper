const React = require('react');
const Button = require('antd/lib/button');
const services = require('../../common/services');

class myReact extends React.Component {
    constructor() {
        super();
        this.state = {
            ha: 'ha'
        };
    }
    render() {
        return (
            <div>{this.state.ha}
                Report
            </div>
        );
    }
}

module.exports = myReact;