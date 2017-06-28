export default {
  namespace: 'queryCourse',
  state: {
    // fileds 表单项
    // 基础搜索
    semsterID: null, // 开课学年
    lessonName: '', // 课程名称
    lessonTeachDepart: '', // 开课院系
    lessonDeport: '', // 上课院系
    lessonTeacher: '', // 开课老师
    lessonGrade: null, // 开课年级
    // 高级搜索
    lessonNo: null, // 课程序号
    allowEmptyTeacher: false, // 允许老师为空
    startWeek: null, // 开始周
    endWeek: null, // 结束周
    weekday: null, // 星期几开课
    time: null, // 第几节开课 - 全天划分为12节
    courseType: null, // 课程类别
    examType: null, // 考试类型
    // 其他数据
    teachDepart: [], // 开课院系可选列表
    depart: [], // 上课院系可选列表
    courseType: [], // 课程类别可选列表
    showAdvancedOptions: false, // 是否显示高级筛选项
    // 展现数据
    allPageNum: 0, // 所有页面数
    curPageNum: 0, // 当前页面数
    showData: [] // 展示数据
  },
  subscriptions: {
    setup({dispatch, history}) {}
  },
  effects: {},
  reducers: {},
};