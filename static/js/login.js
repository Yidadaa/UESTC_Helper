function $(name) {
    return document.querySelector(name);
}
function $$(name) {
    return document.querySelectorAll(name);
}
function clearAll() {
    /**
     * 清除现有页面
     */
    var html = $('html');
    var length = html.childElementCount;
    for (var i = 0; i <= length; i++) {
        html.removeChild(html.childNodes[0]);
    }
}
function newPage(theData) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('/loginPage.html'), true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var login_page_src = xhr.responseText;
            $('html').innerHTML = login_page_src;
            var div = $('form')//将反爬虫数据添加到新页面中
            for (var i in theData) {
                div.appendChild(theData[i]);
            }
            autoComplete();
            $('html').querySelector('.login-button').onclick = function () {
                storage();
            }
        }
    }


}
function getData() {
    /**
     * 获取关键的反爬虫数据
     */
    var data = $$('form input');
    var return_data = [];
    for (var i in data) {
        if (data[i].type == 'hidden') {
            return_data.push(data[i]);
        }
    }

    return return_data;
}
function storage() {
    var username = $('#username');
    var pwd = $('#password');
    if (username.value) {
        chrome.storage.local.set({ 'username': username.value });
    }
    if (pwd.value) {
        chrome.storage.local.set({ 'pwd': pwd.value });
    }
}
function autoComplete() {
    chrome.storage.local.get('username',function (data) {
        $('#username').value=data['username'];
    });
    chrome.storage.local.get('pwd',function (data) {
        $('#password').value=data['pwd'];
    });
}
var data = getData();
clearAll();
newPage(data);
