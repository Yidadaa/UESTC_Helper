/**
 * @file 图表组件
 * @desc 封装echarts组件
 */
const React = require('react');
const echart = require('echarts');
require('./theme/macarons');

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.defaultProps = {
            config: {}
        };
        this.state = {
            chart: null
        };
    }
    componentDidMount() {
        const chart = echart.init(document.getElementById(this.props.id), 'macarons');
        chart.showLoading();
        this.setState({
            chart: chart
        });
    }
    componentDidUpdate() {
        if (this.state.chart != null && this.props.config != undefined) {
            this.state.chart.setOption(this.props.config);
            this.state.chart.hideLoading();
        }
    }
    render() {
        return (
            <div id={this.props.id} style={this.props.style}></div>
        );
    }
}

module.exports = Chart;