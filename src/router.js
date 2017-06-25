import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { Router, Route, Link } from 'dva/router';

import Report from './components/report/index';
import Course from './components/course/index';
import Ecard from './components/ecard/index';
import './index.less';

const { Item } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function RouterConfig({ history }) {
  let pathname = location.hash.match(/\/(.*)\?/) ? location.hash.match(/\/(.*)\?/)[1] : 'report';
  pathname = pathname ? pathname : 'report';
  const menuConfig = {
    mode: 'inline',
    defaultSelectedKeys: [pathname],
  };
  return (<div><Layout>
  <Header id="header"><Row>
    <Col span={1}>
    <img src="http://o8cuifl9z.bkt.clouddn.com/uestc/img/icon.png" alt="icon" className="icon" />
    </Col>
    <Col span={8}>
    <p className="header-title">UESTC - 电子科技大学教务助手</p>
    </Col>
  </Row></Header>
    <Layout>
    <Sider id="sider">
      <Menu {...menuConfig}>
      <Item key="report"><a href="/#/report">成绩信息</a></Item>
      <Item key="course"><a href="/#/course">课程及考试信息</a></Item>
      <Item key="ecard"><a href="/#/ecard">一卡通信息</a></Item>
      <Item>测试</Item>
      <Item>测试</Item>
      <Item>测试</Item>
      <Item>测试</Item>
      <Item>测试</Item>
      </Menu>
      <Footer id="footer">Footer</Footer>
    </Sider>
    <Content id="main-content">
      <Router history={history}>
        <Route exact path="/" component={Report} />
        <Route path="report" component={Report} />
        <Route path="course" component={Course} />
        <Route path="ecard" component={Ecard} />
      </Router>
    </Content>
    </Layout>
  </Layout></div>);
}

export default RouterConfig;
