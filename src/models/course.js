import { init, getCourseData } from '../components/course/services';
import curSemYear from '../utils/getCurSemYear';

export default {
  namespace: 'course',
  state: {
    basicData: null, // 初始化信息
    semester: null, // 学期信息
    course: [],
    detailIndex: 0,
    studyYears: [],
    loading: true,
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/course') {
          dispatch({
            type: 'loadData',
            payload: {}
          });
        }
      });
    }
  },
  effects: {
    *loadData({payload}, {call, put, select}) {
      const {basicData, semester} = yield call(init);
      const admissionYear = yield select(state => state.common.admissionYear);
      yield put({
        type: 'initSuccess',
        payload: {basicData, semester, admissionYear}
      });
      const semesterNum = semester[curSemYear.year][curSemYear.semesterIndex];
      yield put({
        type: 'loadCourseData',
        payload: {semesterNum}
      });
    },
    *loadCourseData({payload}, {call, put, select}) {
      yield put({
        type: 'showLoading',
        payload: {}
      });
      const {semesterNum} = payload;
      const ids = yield select(state => state.course.basicData.ids);
      const courseData = yield call(getCourseData, semesterNum, ids);
      yield put({
        type: 'updateCourse',
        payload: {
          course: courseData
        }
      });
      yield put({
        type: 'changeTabIndex',
        payload: {
          detailIndex: payload.semesterNum
        }
      });
      yield put({
        type: 'hideLoading',
        payload: {}
      });
    },
  },
  reducers: {
    initSuccess(state, action) {
      const {basicData, semester, admissionYear} = action.payload;
      let studyYears = []; // 学年信息
      const numDict = ['一', '二', '三', '四'];
      const semDict = ['上', '下'];
      if (semester) {
        // 把学年选项卡信息写入数组
        for(let i = admissionYear; i <= curSemYear.year; i++) {
          const iYear = semester[i];
          Object.keys(iYear).forEach(v => {
            const name = `大${numDict[i - admissionYear]}${semDict[v]}`; // 如果加入研究生的，这里要改一下
            const index = iYear[v];
            studyYears.push({
              name, index
            });
          });
        }
      }
      return {...state, basicData, semester, studyYears};
    },
    updateCourse(state, action) {
      return {...state, ...action.payload};
    },
    changeTabIndex(state, action) {
      return {...state, ...action.payload};
    },
    hideLoading(state, action) {
      const loading = false;
      return {...state, loading};
    },
    showLoading(state, action) {
      const loading = true;
      return {...state, loading};
    },
  },
};