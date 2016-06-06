function $(name) {
    return document.querySelector(name);
}
function $$(name) {
    return document.querySelectorAll(name);
}
function clearAll() {
    var html = $('html');
    var length = html.childElementCount;
    for (var i = 0; i <= length; i++) {
        html.removeChild(html.childNodes[0]);
    }
}
function newPage() {
    var login_page_src = "<head><title>电子科技大学信息门户</title><link rel='stylesheet' type='text/css' href='static/css/login.css'/><link rel='shortcut icon' href='http://o8cuifl9z.bkt.clouddn.com/uestc/icon/icon.ico'><meta http-equiv='content-type' content='text/html; charset=UTF-8' /></head><body><div class='logo-container'><div class='logo-ico'></div></div><div class='background'></div><div class='login-form'><h1>信息门户登录</h1><div class='login-box'><form id='casLoginForm' role='form' action='/authserver/login' method='post'><div class='login-form-item'><label for='username' class='ico-username'></label><input id='username' name='username' placeholder='请输入学号' class='login-form-input' type='text' value=''/></div><div class='login-form-item'><label for='password' class='ico-password'></label><input id='password' name='password' placeholder='请输入密码' class='login-form-input' type='password' value=''autocomplete='off'/></div><div class='login-other'><span class='how-to-login'><a href='http://idas.uestc.edu.cn/authserver/articles/loginRule.jsp' target='_blank' tabindex='3000'>如何登陆？</a></span><span class='forget-pwd'><a href='http://idas.uestc.edu.cn/authserver/getBackPasswordMainPage.do' target='_blank' tabindex='2000'>忘记密码</a></span></div><button type='submit' class='login-button'>登录</button></form></div></div><div class='footer'><span>Copyright 2016 你大爷 版权所有 技术支持：益达哒</span></div></body>";
    
    $('html').innerHTML = login_page_src;
}
function getData() {
    var data=$$('form input');
    var return_data=[];
    for(var i in data){
        if(data[i].type=='hidden'){
            return_data.push(data[i]);
        }
    }
    
    return return_data;
}
function appendData(theData) {
    var div=$('form');
    for(var i in theData){
        div.appendChild(theData[i]);
    }
}
var data=getData();
//clearAll();
newPage();
appendData(data);