/**
 * @file 数据获取的方法
 * @desc 用来获取原始数据
 */
const parsers = require('./utils/paser');
const services = require('../../services/services');

// let commonData = {};


// const getBasicData = services.parsePage(
//   'http://eams.uestc.edu.cn/eams/courseTableForStd.action', 
//   parsers.parseBasicData
// );

// const getSemesterData = params => {
//   commonData.basicData = params;
//   const url = `http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=${params.tagId}&dataType=semesterCalendar&value=${params.value}&empty=false`;
//   return services.parsePage(url, parsers.parseSemesterData);
// };

// const getCourseData = (semester, ids) => {
//   const url = `http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=${semester}&ids=${ids}`;
//   return services.parsePage(url, parsers.parseCourseData);
// };

async function getBasicData() {
  console.log('getting basicData');
  const url = 'http://eams.uestc.edu.cn/eams/courseTableForStd.action';
  const resText = await services.parsePage(url);
  return parsers.parseBasicData(resText);
}
async function getSemesterData(params) {
  console.log('getting semester');
  const url = `http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=${params.tagId}&dataType=semesterCalendar&value=${params.value}&empty=false`;
  const resText = await services.parsePage(url);
  return parsers.parseSemesterData(resText);
}
async function getCourseData(semester, ids) {
  console.log('getting course');
  const url = `http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=${semester}&ids=${ids}`;
  const resText = await services.parsePage(url);
  return parsers.parseCourseData(resText);
}

async function init() {
  const basicData = await getBasicData();
  const semester = await getSemesterData(basicData);
  return {
    basicData,
    semester
  };
}

// const init = () => {
//   return new Promise((resolve, reject) => {
//     getBasicData.then(getSemesterData).then(res => {
//       commonData.semester = res;
//       resolve({
//         commonData,
//         getCourseData
//       });
//     });
//   });
// };

module.exports = {init, getCourseData};