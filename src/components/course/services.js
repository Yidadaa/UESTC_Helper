/**
 * @file 数据获取的方法
 * @desc 用来获取原始数据
 */
const parsers = require('./utils/paser');
const services = require('../../services/services');

async function getBasicData() {
  const url = 'http://eams.uestc.edu.cn/eams/courseTableForStd.action';
  const resText = await services.parsePage(url);
  return parsers.parseBasicData(resText);
}
async function getSemesterData(params) {
  const url = `http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=${params.tagId}&dataType=semesterCalendar&value=${params.value}&empty=false`;
  const resText = await services.parsePage(url);
  return parsers.parseSemesterData(resText);
}
async function getCourseData(semester, ids) {
  const url = `http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=${semester}&ids=${ids}`;
  const resText = await services.parsePage(url);
  return parsers.parseCourseData(resText);
}

async function getExamData(semester) {
  /**
   * 获取考试信息
   * @param {Number} semester 学期索引
   */
  let semesterExamData = [];
  for (let i = 1; i < 5; i++) {
    const examType = i; // 考试类型1,2,3,4代表了期末|期中|补考|缓考
    const url = 'http://eams.uestc.edu.cn/eams/stdExamTable!examTable.action?examType.id=' + examType + '&semester.id=' + semester;
    const resText = await services.parsePage(url);
    const examData = parsers.parseExamData(resText);
    semesterExamData = semesterExamData.concat(examData.map(v => {
      // 为考试信息添加考试类型字段
      return {
        ...v,
        examType
      };
    }));
  }
  return semesterExamData;
}

async function init() {
  const basicData = await getBasicData();
  const semester = await getSemesterData(basicData);
  return {
    basicData,
    semester
  };
}

module.exports = {init, getCourseData, getExamData};