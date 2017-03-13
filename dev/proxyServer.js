/**
 * @file 代理服务器配置
 * @desc 用于代理开发服务器转发的跨域请求
 */
const express = require('express');
const request = require('request').defaults({jar: true});

const app = express();

const login = () => {
    const account = '2014000201010';
    const password = '204515';
    request('http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F', (error, res) => {
        let values = res.body.match(/<input type="hidden" [^>]*\"\/?\>/g);
        values = values.map(v => {
            let value = v.match(/\.*name="(.*?)" value="(.*?)"\/?>/);
            return [value[1], value[2]];
        });
        let params = {};
        values.forEach(v => {
            params[v[0]] = v[1];
        });
        params.username = account;
        params.password = password;
        values.length == 5 ? request.post('http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F', {form: params}, (err, res) => {
            console.log('登陆成功');
        }) : null;
    });
};
login();
app.get('/url', (req, res) => {
    let url = req.query.url || '/';
    request(url, (error, response) => {
        res.send(response.body);
    });
});

app.listen(3000);