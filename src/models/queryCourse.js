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
    semesterID: null, // 开课学年 {Array}
    curSemesterID: null, // 当前开课学年

    searchFields: {}, // 已选择的筛选项
    showAdvancedOptions: true, // 是否显示高级筛选项
    // 展现数据
    curPageNum: 0, // 当前页面数
    totalCount: 0, // 所有条目数
    pageSize: 20, // 每页容量
    showData: [], // 展示数据
    loading: false, //　加载状态
    selectKeys: [], // 选中条目的key
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
    *initFormField({payload}, {call, put, select}) {
      // 初始化表头数据
      // TODO: 获取表头之后，初始化curSemesterID
      const curSemesterID = yield select(state => state.queryCourse.curSemesterID);
      const {courseType, depart, projectID,
        teachDepart, semesterID} = yield call(getFormField, curSemesterID);
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
      yield put({
        type: 'updateStates',
        payload: {
          loading: true
        }
      });
      const [projectID, pagesize, pageNo] = yield select(state => {
        return [
          state.queryCourse.projectID,
          state.queryCourse.pageSize,
          state.queryCourse.curPageNum
        ];
      });
      let params = Object.assign({}, payload, {
        'lesson.project.id': projectID,
        'lesson.semester.id': '163',
        'pageNo': pageNo,
        'pageSize': pagesize
      });
      if (params['rangeWeek']) {
        const rangeWeek = params['rangeWeek'];
        const startTime = rangeWeek[0];
        const endTime = rangeWeek[1];
        let startWeekSchedule = 0;
        let endWeekSchedule = 0;
        /** 自然周与学年周的转换：假设开学日期是3.1和9.1
         * 这里以学年计算周数，比如一整个学年包含一下时间段
         *     |__________/_________*________|
         * 2017.3.1   2017.9.1    2017.12  2018.3.1
         * 那么只需要计算对应的自然周数，就可以将自然时间转换为学期周了
        **/
        if (!!startTime) {
          const termOne = startTime.clone().month(2).date(1).weeks(); // 今年3.1开学周数
          const termTwo = startTime.clone().month(8).date(1).weeks(); // 今年9.1开学周数
          const termThree = startTime.clone().add(1, 'years')
            .month(2).date(1).weeks() + startTime.weeksInYear(); // 明年3.1开学周数
          let startWeek = startTime.weeks();
          let endWeek = endTime.weeks() + (endTime.year() - startTime.year()) * startTime.weeksInYear();
          if (startWeek < termOne && endWeek < termOne) {
            // 都在今年1-3月份之间，为了保持计算一致性，统一放到明年来算
            startWeek += startTime.weeksInYear();
            endWeek += startTime.weeksInYear();
          }
          if (endWeek < termTwo) {
            // 表示选中范围是前半年
            startWeekSchedule = Math.max(0, startWeek - termOne) + 1;
            endWeekSchedule = endWeek - termOne + 1;
          } else {
            // 表示选中范围在后半年
            startWeekSchedule = Math.max(0, startWeek - termTwo) + 1;
            endWeekSchedule = endWeek - termTwo + 1;
          }
          delete params['rangeWeek']; // 删除多余项
          params = Object.assign({}, params, {startWeekSchedule, endWeekSchedule});
        }
      }
      const { tableContent, curPageNum, pageSize, totalCount } = yield call(queryCourse, params);
      yield put({
        type: 'updateStates',
        payload: {
          showData: tableContent, curPageNum, pageSize, totalCount,
          loading: false
        }
      });
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