/**
 * @file 代理服务器配置
 * @desc 用于代理开发服务器转发的跨域请求
 */
const express = require('express');
const request = require('request');

const app = express();

app.get('/url', (req, res) => {
    let url = req.query.url || '/';
    request(url, (error, response) => {
        res.send(response.body);
    });
});

app.listen(3000);