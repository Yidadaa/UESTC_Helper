import {getFormField, queryCourse} from '../components/queryOfferCourse/services';

export default {
  namespace: 'queryCourse',
  state: {
    // fields 表单项
    // 基础搜索
    // lessonName: '', // 课程名称
    // lessonTeachDepart: '', // 开课院系
    // lessonDeport: '', // 上课院系
    // lessonTeacher: '', // 开课老师
    // lessonGrade: null, // 开课年级
    // // 高级搜索
    // lessonNo: null, // 课程序号
    // allowEmptyTeacher: false, // 允许老师为空
    // startWeek: null, // 开始周
    // endWeek: null, // 结束周
    // weekday: null, // 星期几开课
    // time: null, // 第几节开课 - 全天划分为12节
    // courseType: null, // 课程类别
    // examType: null, // 考试类型
    // // 其他数据
    teachDepart: [], // 开课院系可选列表
    depart: [], // 上课院系可选列表
    courseType: [], // 课程类别可选列表
    projectID: 1,
    semesterID: null, // 开课学年

    searchFields: {}, // 已选择的筛选项
    showAdvancedOptions: true, // 是否显示高级筛选项
    // 展现数据
    allPageNum: 0, // 所有页面数
    curPageNum: 0, // 当前页面数
    showData: [] // 展示数据
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/queryCourse') {
          dispatch({
            type: 'initFormField',
            payload: {}
          });
        }
      });
    }
  },
  effects: {
    *initFormField({payload}, {call, put}) {
      // 初始化表头数据
      const {courseType, depart, projectID,
        teachDepart, semesterID} = yield call(getFormField);
      yield put({
        type: 'updateStates',
        payload: {
          courseType, depart, teachDepart,
          lessonTDAutoComList: teachDepart,
          semesterID, projectID
        }
      });
    },
    *search({payload}, {call, put, select}) {
      // 执行搜索
      const projectID = yield select(state => state.queryCourse.projectID);
      console.log(payload, projectID);
      let params = Object.assign({}, payload, {'lesson.project.id': projectID});
      if (params['rangeWeek']) {
        const rangeWeek = params['rangeWeek'];
        const startTime = rangeWeek[0];
        const endTime = rangeWeek[1];
        // 假设开学日期是3.1和9.1
        // TODO: 判断起止周
        console.log(rangeWeek);
      }
      // const res = yield call(queryCourse, params);
      // 对数据进行一些预处理
    }
  },
  reducers: {
    updateStates(state, action) {
      // 更新表头状态
      return {...state, ...action.payload};
    },
    updateFields(state, action) {
      // 更新搜索条件，并执行搜索
      return {...state, ...action.payload};
    }
  },
};