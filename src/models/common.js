/**
 * Model - 公共数据，无论加载哪个页面都需要的数据
 */
import services from '../services/services';
import parser from '../components/report/utils/parser';

export default {
  namespace: 'common',
  state: {
    admissionYear: 2014, // 入学年份
  },
  subscriptions: {
    setup({dispatch, history}) {
      dispatch({
        type: 'loadData',
        payload: {}
      });
    }
  },
  effects: {
    *loadData({payload}, {call, put}) {
      // 需要知道使用者的入学年份
      // 这里需要和登录界面联动
      yield put({
        type: 'updateAdmissionYear',
        payload: {
          admissionYear: 2014
        }
      });
    },
  },
  reducers: {
    updateAdmissionYear(state, action) {
      return {...state, ...action.payload};
    },
  },
};