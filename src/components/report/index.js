/**
 * @file 组件 - 成绩单
 * @desc 成绩汇总，成绩趋势，成绩详单，挂科分析
 */

import {connect} from 'dva';
import react  from 'react';

import {Row, Col, Menu} from 'antd';

import Table from './components/Table.jsx';
import Chart from '../common/chart/chart.jsx';
import FailedExam from './components/FailedExam.jsx';

import config from './config';

require('./style.less');

const myReact = ({report, dispatch}) => {
  const props = report;
  const {data} = report;
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
  /**
   * 图表配置
   */
  let gpaConfig;
  let averConfig;
  let studyConfig;
  let lineChartConfig;
  if (data) {  
    gpaConfig = config.chartConfig(data.sum.detail.gpa);
    averConfig = config.chartConfig(data.sum.detail.aver);
    studyConfig = config.chartConfig(data.sum.detail.study);
    lineChartConfig = config.lineChartConfig(data);
  }
  return (
    <div className="block">
      <Row><div id="abstract"> 
        <Col xs={24} sm={12}>
          <Col className="little-block" id="gpa-sum" span={8}>
            <Chart style={littleChartStyle} id="gpa-chart" config={gpaConfig} key="gpa-chart"></Chart>
            <span className="title">GPA</span>
            <span className="value">{props.gpa}</span>
          </Col>
          <Col className="little-block" id="aver-grade" span={8}>
            <Chart style={littleChartStyle} id="aver-chart" config={averConfig} key="aver-chart"></Chart>
            <span className="title">平均分</span>
            <span className="value">{props.aver}</span>
          </Col>
          <Col className="little-block" id="study-grade" span={8}>
            <Chart style={littleChartStyle} id="study-chart" config={studyConfig} key="grade-chart"></Chart>
            <span className="title">总学分</span>
            <span className="value">{props.study}</span>
          </Col>
        </Col>
        <Col id="chart-2" xs={24} sm={12}>
          <Chart id="line-chart" config={lineChartConfig} style={lineChartStyle} key="line-chart"></Chart>
        </Col>
      </div></Row>
      <FailedExam allCourseData={allCourseData}></FailedExam>
      <div id="detail">
        <div id="detail-header">
          <div id="detail-title">{detailData.year ? detailData.year + '学期详细成绩': '详细成绩'}</div>
          <div className="detail-menu">
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