/**
 * 考试安排列表
 */
import React from 'react';
import {Spin, Row, Col, Card, Icon} from 'antd';
import  style from  './style.less';

export default (props) => {
  const {exam, isLoading} = props;
  const timelineConfig = {};
  const examDict = ['期末考试', '期中考试', '补考', '缓考'];
  return (
    <Spin spinning={isLoading} tip="加载中...">
      <Row gutter={16}>
        {exam.length > 0
        ? exam.map((v, i) => {
          return (<Col key={i} span={8} className={ style.examRow }>
            <Card title={v.name} className={ style.examCard } bordered={ false }>
              <p><Icon type="calendar" /> {v.date}</p>
              <p><Icon type="clock-circle-o" /> {v.detail}</p>
              <p><Icon type="home" /> {v.address} {v.num}号</p>
              <p><Icon type="tag-o" /> {examDict[v.examType - 1]}</p>
              <p><Icon type="info-circle-o" /> {v.status}</p>
            </Card>
          </Col>);
        })
        : <Col span={24} style={{textAlign: 'center'}}>
          <Card title="- 暂时没有考试 -" loading={true}></Card>
        </Col>}
      </Row>
    </Spin>
  );
}