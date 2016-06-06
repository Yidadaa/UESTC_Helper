function $(name) {
    return document.querySelector(name);
}
var xhr = new XMLHttpRequest();
$('button').addEventListener("click", function() {
    window.open('http://idas.uestc.edu.cn/authserver/login?service=http%3A%2F%2Fportal.uestc.edu.cn%2F');
});
