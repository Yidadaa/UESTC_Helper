/*eslint-disable*/
/**
 * @file 代理服务器配置
 * @desc 用于代理开发服务器转发的跨域请求
 */
const express = require('express');
const portalRequest = require('request').defaults({jar: true});
const ecardRequest = require('request').defaults({jar: true});
const request = portalRequest;

const app = express();

let cookies = {}; // 保存会话
// let jars = [];

const getCookie = (res) => {
    // 将cookie写入会话
    const jar = request.jar();
    const resCookie = res.headers['set-cookie'];
    // const cookies = resCookie.map(v => {
    //     jar.setCookie(request.cookie(v));
    // });
    return resCookie;
};

const login = ({url, index, request}) => {
    lastLoginTime = new Date().getTime();
    const account = '2014000201010';
    const password = '204515';
    request(url, (error, res) => {
        if (error) {
            console.log(error);
            console.error(
                `\n=======================
                 \n-   代理服务器登录失败   -
                 \n=======================\n`
            ); // 模拟登陆，并且获得cookie，以后的每次请求都会默认使用cookie
            return null;
        }
        let values = res.body.match(/<input type="hidden" [^>]*\"\/?\>/g);
        values = values.map(v => { // 从首页获取关键key
            let value = v.match(/\.*name="(.*?)" value="(.*?)"\/?>/);
            return value ? [value[1], value[2]] : null;
        });
        let params = {};
        values.forEach(v => {
            params[v[0]] = v[1];
        });
        params.username = account;
        params.password = password;
        values.length == 5 ? request.post(url, {form: params}, (err, res, body) => {
            cookies[index] = getCookie(res);
            console.log(`\n##${index}代理成功\n`);
        }) : null;
    });
};
const portal = {
    url: 'http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F',
    index: 'portal.uestc.edu.cn',
    request: portalRequest
};
const ecard = {
    url: 'http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fecard.uestc.edu.cn%2Fcaslogin.jsp',
    index: 'ecard.uestc.edu.cn',
    request: ecardRequest
};
login(portal);
login(ecard);
app.get('/url', (req, res) => {
    // const curTime = new Date().getTime();
    // if (curTime - lastLoginTime >= 1000 * 60 * 20) {
    //     login(); // 每二十分钟重新登录一次，防止cookie失效
    // }
    const request = portalRequest;
    let url = '';
    for(let i in req.query) {
        if(i == 'url') {
            url = `${req.query[i]}`;
        } else {
            url = `${url}&${i}=${req.query[i]}`;
        }
    }
    const domain = req.query.url.match(/\/\/(.*?)\//)[1];
    console.log(`代理：GET/${url}`);
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    request({url, jar: jars[domain]}, (error, response) => {
        if (error) {
            res.status(500).send('学校服务器抽风了！');
        } else {
            res.send(response.body);
        }
    });
});

app.listen(3000);