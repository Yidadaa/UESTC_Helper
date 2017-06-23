import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';
import Report from './components/report/index';
import './index.less'

const { Item } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function RouterConfig({ history }) {
  const menuConfig = {
  mode: 'inline',
  defaultSelectedKeys: ['report'],
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
      <Item key="report"><a to="/report">成绩信息</a></Item>
      <Item key="course"><a to="/course">课程及考试信息</a></Item>
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
      <Route path="/report" component={Report} />
      </Router>
    </Content>
    </Layout>
  </Layout></div>);
}

export default RouterConfig;
