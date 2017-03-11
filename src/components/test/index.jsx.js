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
    componentDidMount() {
        services.parsePage('www.baidu.com', (res) => {return res;}).then(res => {
            this.setState({
                ha: res.statusText
            });
        });
    }
    render() {
        return (
            <div>{this.state.ha}
                <span>fasfd</span>
                <span>热更新模块</span>
                <Button>sfd</Button>
            </div>
        );
    }
}

module.exports = myReact;