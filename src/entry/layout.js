/**
 * @file 主页面布局
 * @desc 定义各个组件的入口，路由等信息
 */
const React = require('react');
const {HashRouter, Route, Link} = require('react-router-dom');
const Layout = require('antd/lib/layout');
const Menu = require('antd/lib/menu');
const Row = require('antd/lib/row');
const Col = require('antd/lib/col');
const {Item} = Menu;
const {Header, Content, Footer, Sider} = Layout;

const Report = require('../components/report/index');
const Course = require('../components/course/index');

class LayoutDom extends React.Component {
    render() {
        const menuConfig = {
            mode: 'inline',
            defaultSelectedKeys: ['report']
        };
        return (
            <div>
                <Layout>
                    <Header id="header"><Row>
                        <Col span={1}>
                            <img src="http://o8cuifl9z.bkt.clouddn.com/uestc/img/icon.png" alt="icon" className="icon"/>
                        </Col>
                        <Col span={8}>
                            <p className="header-title">UESTC</p>
                        </Col>
                    </Row></Header>
                    <HashRouter>
                        <Layout>
                            <Sider id="sider">
                                <Menu {...menuConfig}>
                                    <Item key='report'><Link to='/report'>成绩信息</Link></Item>
                                    <Item key='course'><Link to='/course'>课程及考试信息</Link></Item>
                                    <Item>测试</Item>
                                    <Item>测试</Item>
                                    <Item>测试</Item>
                                    <Item>测试</Item>
                                    <Item>测试</Item>
                                </Menu>
                                <Footer id="footer">Footer</Footer>
                            </Sider>
                            <Content id="main-content">
                                <Route exact path='/' component={Report}></Route>
                                <Route path='/report' component={Report}></Route>
                                <Route path='/course' component={Course}></Route>
                            </Content>
                        </Layout>
                    </HashRouter>
                </Layout>
            </div>
        );
    }
}
module.exports = LayoutDom;