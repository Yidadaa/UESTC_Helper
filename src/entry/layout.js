/**
 * @file 主页面布局
 * @desc 定义各个组件的入口，路由等信息
 */
const React = require('react');
const {HashRouter, Route, Link} = require('react-router-dom');
const Layout = require('antd/lib/layout');
const Menu = require('antd/lib/menu');
const {Item} = Menu;
const {Header, Content, Footer, Sider} = Layout;

const Report = require('../components/report/index');
const Library = require('../components/library/index');

class LayoutDom extends React.Component {
    render() {
        const menuConfig = {
            mode: 'inline'
        };
        return (
            <div>
                <Layout>
                    <Header>Header</Header>
                    <HashRouter>
                        <Layout>
                            <Sider>
                                <Menu {...menuConfig}>
                                    <Item key={1}><Link to='/library'>图书馆</Link></Item>
                                    <Item key={2}><Link to='/report'>成绩信息</Link></Item>
                                </Menu>
                            </Sider>
                            <Content>
                                <Route exact path='/' component={Report}></Route>
                                <Route path='/report' component={Report}></Route>
                                <Route path='/library' component={Library}></Route>
                            </Content>
                        </Layout>
                    </HashRouter>
                    <Footer>Footer</Footer>
                </Layout>
            </div>
        );
    }
}
module.exports = LayoutDom;