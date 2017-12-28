import {getGradeData} from '../components/report/services';

export default {

  namespace: 'report',

  state: {
    data: null,
    aver: 0,
    gpa: 0,
    study: 0,
    detailIndex: 0
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        if (location.pathname === '/report' || location.pathname === '/') {
          dispatch({
            type: 'loadData',
            payload: {}
          });
        }
      });
    },
  },

  effects: {
    *loadData({ payload }, { call, put }) {
      const res = yield call(getGradeData);
      yield put({
        type: 'updateData',
        payload: {
          data: res,
          aver: res.sum.sum.aver,
          gpa: res.sum.sum.gpa,
          study: res.sum.sum.study,
          detailIndex: res.detail.length - 1
        }
      });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    updateData(state, action) {
      const params = action.payload;
      return { ...state, ...params };
    },
    changeTabIndex(state, action) {
      return { ...state, ...action.payload };
    }
  },

};