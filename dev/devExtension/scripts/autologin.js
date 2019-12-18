console.log('auto login')
/**
 * 处理自动登录逻辑
 */

function $(string) {
  return document.querySelector(string)
}

const username = '20241000602010'
const passwd = '415513'

$('#username').value = username
$('#password').value = passwd
$('#casLoginForm').submit()
