console.log('auto login')
/**
 * 处理自动登录逻辑
 */

function $(string) {
  return document.querySelector(string)
}

const username = '2014000201010'
const passwd = '204515'

document.body.onload = () => {
  $('#username').value = username
  $('#password').value = passwd
  $('#casLoginForm').submit()
}