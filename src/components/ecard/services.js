/**
 * @file 获取一卡通的数据
 */
import { parseTradeTable, parseBasicInfo } from './parser';
import { sendRequest } from '../../services/services';

/**
 * @name 获取交易流水数据
 * @param {Object} params表示该接口的参数，下面是params的接口内容
 *   const params = {
        curPage: 2, // 原接口用于分页的参数，当前页数
        pageSize: 10, // 每页包含项目数
        dateRange: 7, // 查询的日期范围，可以是7/30/180天
        type: 2 // 查询交易的类型 1-充值/2-消费/3-电费充值
      };
  * @return {Object} 解析到的数据
  */
async function getTransactionFlow(params) {
  const baseUrl = 'http://ecard.uestc.edu.cn/web/guest/personal';
  const queryString = {
    p_p_id: 'transDtl_WAR_ecardportlet',
    p_p_lifecycle: 0,
    p_p_state: 'exclusive',
    p_p_mode: 'view',
    p_p_col_id: 'column-4',
    p_p_col_count: 1,
    _transDtl_WAR_ecardportlet_action: 'dtlmoreview'
  };
  const param = {
    _transDtl_WAR_ecardportlet_cur: params['curPage'] || 1,
    _transDtl_WAR_ecardportlet_delta: params['pageSize'] || 10,
    _transDtl_WAR_ecardportlet_qdate: params['dateRange'] || 30,
    _transDtl_WAR_ecardportlet_qtype: params['typpe'] || 2
  };
  const paramters = Object.keys(queryString).map(v => {
    return [v, queryString[v]].join('=');
  }).concat(Object.keys(param).map(v => {
    return [v, param[v]].join('=');
  })).join('&');
  const url = `${baseUrl}?${paramters}`;
  const resText = await sendRequest(url);
  return parseTradeTable(resText);
}

/**
 * 获取用户基础信息
 * @param {Object} params
 * @return {Object} 解析到的数据
 */
async function getBasicInfo(params) {
  const url = 'http://ecard.uestc.edu.cn/web/guest/personal';
  const resText = await sendRequest(url);
  return parseBasicInfo(resText);
}

/**
 * 获取最近消费数据
 * @param {Object} params 
 *    params = {
 *      type: 'consumeStat', 'dpsStat', 'consumeComp', 消费趋势、充值地点统计、消费地点统计
 *      dateRange: Number 最近n天的数据
 *    }
 */
async function getRecentData(params) {
  const baseUrl = 'http://ecard.uestc.edu.cn/web/guest/myactive';
  const basicParams = {
    p_p_id: 'myActive_WAR_ecardportlet',
    p_p_lifecycle: 2,
    p_p_state: 'normal',
    p_p_mode: 'view',
    p_p_resource_id: params['type'],
    p_p_cacheability: 'cacheLevelPage',
    p_p_col_id: 'column-1',
    p_p_col_count: 1,
    _myActive_WAR_ecardportlet_days: params['dateRange'] || 30
  };
  const paramters = Object.keys(basicParams).map(v => {
    return [v, basicParams[v]].join('=');
  }).join('=');
  const url = `${baseUrl}?${paramters}`;
  const res = await sendRequest(url); // 这部分的接口不需要解析
  return res;
}

export default {
  getTransactionFlow,
  getBasicInfo,
  getRecentData
};