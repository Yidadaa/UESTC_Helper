/**
 * @file 从源网页解析所需的数据
 */

/**
* 解析用户基本信息
*/
function parseBasicInfo(text) {
  const node = document.createElement('div');
  node.innerHTML = text;
  const userInfoNode = node.querySelector('.user_mess');
  const avatar = userInfoNode.querySelector('img').src;
  const name = userInfoNode.querySelector('.text2').innerText.replace('，', '');
  const studentID = userInfoNode.querySelector('.c_f65151').innerText;

  const cardInfoNode = node.querySelector('.card-info');
  const cardInfoArray = Array.from(cardInfoNode.querySelectorAll('tr'))
    .map(v => Array.from(v.children)[0].innerText).slice(0, 5);
  const res = {
    name, avatar, studentID,
    cardID: cardInfoArray[0].replace('卡号：', ''),
    cardState: cardInfoArray[1].replace('卡状态：', ''),
    cardBalance: cardInfoArray[2].replace(/[^0-9\.]/g, ''),
    cardDate: cardInfoArray[3].replace(/[^0-9\-]/g, ''),
    unRecieved: cardInfoArray[4].replace(/[^0-9\.]/g, ''),
  }
  return res;
}

/**
 * 解析流水数据
 */
function parseTradeTable(text) {
  const node = document.createElement('div');
  node.innerHTML = text;
  const table = node.querySelector('.trade_table');
  const arrayRes = Array.from(table.querySelectorAll('tr'))
    .map(v => Array.from(v.children).map(e => e.innerText)).slice(1); // 获取流水详情
  const summary = Array.from(table.nextElementSibling.querySelectorAll('span'))
    .map(v => v.innerText); // 获取消费/支出总计
  let res = {
    summay: {
      expense: summary[0], // 消费
      recharge: summary[1] // 充值
    },
    detail: arrayRes
  }
  return res;
}

export default {
  parseTradeTable,
  parseBasicInfo
};