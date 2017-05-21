/**
 * @file 组件 - 成绩单
 * @desc 成绩汇总，成绩趋势，成绩详单，挂科分析
 */
const React = require('react');

const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const Menu = require('antd/lib/menu');

const Table = require('./components/Table.jsx');
const Chart = require('../common/chart/chart.jsx');
const FailedExam = require('./components/FailedExam.jsx');

const services = require('../../common/services');
const parser = require('./utils/parser');
const config = require('./config');

require('./style.less');

class myReact extends React.Component {
    constructor() {
        super();
        this.state = {
            data: null,
            gpaConfig: null,
            averConfig: null,
            studuConfig: null,
            lineChartConfig: null,
            aver: 0,
            gpa: 0,
            study: 0,
            detailIndex: 0
        };
    }
    componentWillMount() {
        const me = this;
        const url = 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR';
        services.parsePage(url, parser).then(res => {
            me.setState({
                data: res,
                gpaConfig: config.chartConfig(res.sum.detail.gpa),
                averConfig: config.chartConfig(res.sum.detail.aver),
                studyConfig: config.chartConfig(res.sum.detail.study),
                lineChartConfig: config.lineChartConfig(res),
                aver: res.sum.sum.aver,
                gpa: res.sum.sum.gpa,
                study: res.sum.sum.study,
                detailIndex: res.detail.length - 1
            });
        });
    }
    render() {
        const littleChartStyle = {
            height: '150px',
            width: '150px',
            margin: 'auto'
        };
        const lineChartStyle = {
            height: '200px',
            margin: 'auto'
        };
        const detail = this.state.data ? this.state.data.detail : [];
        const menuConfig = {
            onClick: (e) => {
                this.setState({
                    detailIndex: e.key
                });
            },
            mode: 'horizontal',
            selectedKeys: [this.state.detailIndex.toString()]
        };
        const detailData = this.state.data ? this.state.data.detail[this.state.detailIndex] : {};
        const allCourseData = this.state.data ? this.state.data.detail : [];
        return (
            <div className="block">
                <Row><div id="abstract">
                    <Col xs={24} sm={12}>
                        <Col className="little-block" id="gpa-sum" span={8}>
                            <Chart style={littleChartStyle} id="gpa-chart" config={this.state.gpaConfig} key="gpa-chart"></Chart>
                            <span className="title">GPA</span>
                            <span className="value">{this.state.gpa}</span>
                        </Col>
                        <Col className="little-block" id="aver-grade" span={8}>
                            <Chart style={littleChartStyle} id="aver-chart" config={this.state.averConfig} key="aver-chart"></Chart>
                            <span className="title">平均分</span>
                            <span className="value">{this.state.aver}</span>
                        </Col>
                        <Col className="little-block" id="study-grade" span={8}>
                            <Chart style={littleChartStyle} id="study-chart" config={this.state.studyConfig} key="grade-chart"></Chart>
                            <span className="title">总学分</span>
                            <span className="value">{this.state.study}</span>
                        </Col>
                    </Col>
                    <Col id="chart-2" xs={24} sm={12}>
                        <Chart id="line-chart" config={this.state.lineChartConfig} style={lineChartStyle} key="line-chart"></Chart>
                    </Col>
                </div></Row>
                <FailedExam allCourseData={allCourseData}></FailedExam>
                <div id="detail">
                    <div id="detail-header">
                        <div id="detail-title">{detailData.year ? detailData.year + '学期详细成绩': '详细成绩'}</div>
                        <div id="detail-menu">
                            <Menu {...menuConfig}>
                                {detail.map((v, i) => {
                                    return (
                                        <Menu.Item key={i}>{v.year}</Menu.Item>
                                    );
                                })}
                            </Menu>
                        </div>
                    </div>
                    <Table {...detailData}></Table>
                </div>
            </div>
        );
    }
}

module.exports = myReact;