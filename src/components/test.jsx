const React = require('react');

class myReact extends React.Component {
    constructor () {
        super();
        this.state = {
            ha: 'ha'
        };
    }
    render () {
        return (
            <div>{this.state.ha}
                <span>fasfd</span>
            </div>
        );
    }
}

module.exports = myReact;