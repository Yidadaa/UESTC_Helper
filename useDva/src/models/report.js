const services = require('../services/services');
const parser = require('../components/report/utils/parser');
const config = require('../components/report/config.js');

export default {

    namespace: 'report',

    state: {
        data: null,
        gpaConfig: null,
        averConfig: null,
        studuConfig: null,
        lineChartConfig: null,
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
            const url = 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR';
            const resText = yield services.parsePage(url);
            const res = parser(resText);
            yield put({
                type: 'updateData',
                payload: {
                    data: res,
                    gpaConfig: config.chartConfig(res.sum.detail.gpa),
                    averConfig: config.chartConfig(res.sum.detail.aver),
                    studyConfig: config.chartConfig(res.sum.detail.study),
                    lineChartConfig: config.lineChartConfig(res),
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
