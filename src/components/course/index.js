const React = require('react');
const func = require('./handle');

class myReact extends React.Component {
    constructor() {
        super();
        this.state = {
            commonData: {},
            getCourseData: () => {}
        };
    }
    componentDidMount() {
        func().then(res => {
            this.setState(...res);
            res.getCourseData(143, res.commonData.basicData.ids).then(res => {
                console.log(res);
            });
        });
    }
    render() {
        return (
            <div>
                library
            </div>
        );
    }
}

module.exports = myReact;