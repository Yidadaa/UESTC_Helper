/*eslint-disable*/
/**
 * @file 代理服务器配置
 * @desc 用于代理开发服务器转发的跨域请求
 */
const express = require('express');
const request = require('request').defaults({jar: true});

const app = express();

let lastLoginTime = 0;

const login = () => {
    lastLoginTime = new Date().getTime();
    const account = '2014000201010';
    const password = '204515';
    request('http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F', (error, res) => {
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
        values.length == 5 ? request.post('http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F', {form: params}, (err, res) => {
            console.log(
                `\n=======================
                 \n-   代理服务器登录成功   -
                 \n=======================\n`
            ); // 模拟登陆，并且获得cookie，以后的每次请求都会默认使用cookie
        }) : null;
    });
};
login();
app.get('/url', (req, res) => {
    // const curTime = new Date().getTime();
    // if (curTime - lastLoginTime >= 1000 * 60 * 20) {
    //     login(); // 每二十分钟重新登录一次，防止cookie失效
    // }
    let url = '';
    for(let i in req.query) {
        if(i == 'url') {
            url = `${req.query[i]}`;
        } else {
            url = `${url}&${i}=${req.query[i]}`;
        }
    }
    console.log(`代理：GET/${url}`);
    request(url, (error, response) => {
        if (error) {
            res.status(500).send('学校服务器抽风了！');
        } else {
            res.send(response.body);
        }
    });
});

app.listen(3000);