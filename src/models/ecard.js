import {getTransactionFlow} from '../components/ecard/services';

export default {
  namespace: 'ecard',
  state: {},
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/ecard') {
          dispatch({
            type: 'loadData',
            payload: {}
          });
        }
      });
    },
  },
  effects: {
    *loadData({payload}, {call, put}) {
      // 初始化数据
      const basicData = yield call(getTransactionFlow);
    }
  },
  reducers: {},
};