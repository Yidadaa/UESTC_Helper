const React = require('react');
const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const Chart = require('../common/chart/chart.jsx');
const services = require('../../common/services');
const parser = require('./utils/parser');
const config = require('./config');

require('./style.less');

class myReact extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
            gpaConfig: config.chartConfig([]),
            averConfig: config.chartConfig([]),
            studuConfig: config.chartConfig([]),
            lineChartConfig: config.lineChartConfig({eachYear: {aver: [], gpa: [], study: []}}),
            aver: 0,
            gpa: 0,
            study: 0
        };
    }
    componentWillMount() {
        const me = this;
        const url = 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR';
        services.parsePage(url, parser).then(res => {
            console.log(res);
            me.setState({
                data: res,
                gpaConfig: config.chartConfig(res.sum.detail.gpa),
                averConfig: config.chartConfig(res.sum.detail.aver),
                studyConfig: config.chartConfig(res.sum.detail.study),
                lineChartConfig: config.lineChartConfig(res),
                aver: res.sum.sum.aver,
                gpa: res.sum.sum.gpa,
                study: res.sum.sum.study
            });
        });
    }
    render() {
        const littleChartStyle = {
            height: '150px',
            width: '180px',
            margin: 'auto'
        };
        const lineChartStyle = {
            height: '200px',
            width: '450px',
            margin: 'auto'
        };
        return (
            <div className="block">
                <Row id="abstract">
                    <Col id="chart-1" xs={24} sm={12}>
                        <Col className="little-block" id="gpa-sum" span={8}>
                            <Chart style={littleChartStyle} className="little-chart" id="gpa-chart" config={this.state.gpaConfig}></Chart>
                            <span id="title">GPA</span>
                            <span id="value">{this.state.gpa}</span>
                        </Col>
                        <Col className="little-block" id="aver-grade" span={8}>
                            <Chart style={littleChartStyle} className="little-chart" id="aver-chart" config={this.state.averConfig}></Chart>
                            <span id="title">平均分</span>
                            <span id="value">{this.state.aver}</span>
                        </Col>
                        <Col className="little-block" id="study-grade" span={8}>
                            <Chart style={littleChartStyle} className="little-chart" id="study-chart" config={this.state.studyConfig}></Chart>
                            <span id="title">总学分</span>
                            <span id="value">{this.state.study}</span>
                        </Col>
                    </Col>
                    <Col id="chart-2" xs={24} sm={12}>
                        <Chart id="line-chart" config={this.state.lineChartConfig} style={lineChartStyle}></Chart>
                    </Col>
                </Row>
                <div id="detail">
                    <div id="detail-chart"></div>
                </div>
            </div>
        );
    }
}

module.exports = myReact;