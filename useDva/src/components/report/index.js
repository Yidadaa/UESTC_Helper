/**
 * @file 组件 - 成绩单
 * @desc 成绩汇总，成绩趋势，成绩详单，挂科分析
 */

import { connect } from 'dva';
const React = require('react');

const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const Menu = require('antd/lib/menu');

const Table = require('./components/Table.jsx');
const Chart = require('../common/chart/chart.jsx');
const FailedExam = require('./components/FailedExam.jsx');


const parser = require('./utils/parser');
const config = require('./config');

require('./style.less');

const myReact = ({report, dispatch}) => {
  const props = report;
  const littleChartStyle = {
    height: '150px',
    width: '150px',
    margin: 'auto'
  };
  const lineChartStyle = {
    height: '200px',
    margin: 'auto'
  };
  const detail = props.data ? props.data.detail : [];
  const menuConfig = {
    onClick: (e) => {
      dispatch({
        type: 'report/changeTabIndex',
        payload: {
          detailIndex: e.key
        }
      });
    }, 
    mode: 'horizontal',
    selectedKeys: [props.detailIndex.toString()]
  };
  const detailData = props.data ? props.data.detail[props.detailIndex] : {};
  const allCourseData = props.data ? props.data.detail : [];
  return (
    <div className="block">
      <Row><div id="abstract"> 
        <Col xs={24} sm={12}>
          <Col className="little-block" id="gpa-sum" span={8}>
            <Chart style={littleChartStyle} id="gpa-chart" config={props.gpaConfig} key="gpa-chart"></Chart>
            <span className="title">GPA</span>
            <span className="value">{props.gpa}</span>
          </Col>
          <Col className="little-block" id="aver-grade" span={8}>
            <Chart style={littleChartStyle} id="aver-chart" config={props.averConfig} key="aver-chart"></Chart>
            <span className="title">平均分</span>
            <span className="value">{props.aver}</span>
          </Col>
          <Col className="little-block" id="study-grade" span={8}>
            <Chart style={littleChartStyle} id="study-chart" config={props.studyConfig} key="grade-chart"></Chart>
            <span className="title">总学分</span>
            <span className="value">{props.study}</span>
          </Col>
        </Col>
        <Col id="chart-2" xs={24} sm={12}>
          <Chart id="line-chart" config={props.lineChartConfig} style={lineChartStyle} key="line-chart"></Chart>
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

const mapStateToProps = ({report}) => {
  return {report};
};

export default connect(mapStateToProps)(myReact);