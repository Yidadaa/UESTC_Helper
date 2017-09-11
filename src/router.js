import React from 'react';
import { Layout, Menu, Row, Col } from 'antd';
import { Router, Route, Link } from 'dva/router';

import Report from './components/report/index';
import Course from './components/course/index';
import Ecard from './components/ecard/index';
import QueryCourse from './components/queryOfferCourse/index';
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
  const entries = [ // 配置入口，默认key就是path
    {
      key: 'report',
      component: Report,
      name: '成绩信息',
      active: true
    }, {
      key: 'course',
      component: Course,
      name: '课程及考试信息',
      active: true
    }, {
      key: 'ecard',
      component: Ecard,
      name: '一卡通信息',
      active: false
    }, {
      key: 'queryCourse',
      component: QueryCourse,
      name: '全校开课查询',
      active: true
    }
  ];
  const routes = {
    path: '/',
    childRoutes: entries.map(v => {
      return {
        path: v.key,
        component: v.component
      };
    })
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
      {
        entries.map(v => {
          return v.active ? <Item key={v.key}><a href={`/#/${v.key}`}>{v.name}</a></Item> : null;
        })
      }
      <Item>测试</Item>
      <Item>测试</Item>
      <Item>测试</Item>
      <Item>测试</Item>
      </Menu>
      <Footer id="footer">Footer</Footer>
    </Sider>
    <Content id="main-content">
      <Router history={history} routes={routes}/>
    </Content>
    </Layout>
  </Layout></div>);
}

export default RouterConfig;
