/**
 * 考试安排列表
 */
import React from 'react';
import {Spin, Row, Col, Card} from 'antd';

export default (props) => {
  const {exam, isLoading} = props;
  const timelineConfig = {};
  const examDict = ['期末考试', '期中考试', '补考', '缓考'];
  return (
    <Spin spinning={isLoading} tip="加载中...">
      <Row gutter={16}>
        {exam.length > 0
        ? exam.map((v, i) => {
          return (<Col key={i} span={8} style={{paddingBottom: '10px'}}>
            <Card title={v.name}>
              <p>日期：{v.date}</p>
              <p>考场：{v.address}</p>
              <p>座位：{v.num}</p>
              <p>类型：{examDict[v.examType - 1]}</p>
              <p>状态：{v.status}</p>
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