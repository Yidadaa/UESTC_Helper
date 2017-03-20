/**
 * @file 数据获取的方法
 * @desc 用来获取原始数据
 */
const parsers = require('./utils/paser');
const services = require('../../common/services');

let commonData = {};

const getBasicData = services.parsePage(
    'http://eams.uestc.edu.cn/eams/courseTableForStd.action', 
    parsers.parseBasicData
);

const getSemesterData = params => {
    commonData.basicData = params;
    const url = `http://eams.uestc.edu.cn/eams/dataQuery.action?tagId=${params.tagId}&dataType=semesterCalendar&value=${params.value}&empty=false`;
    return services.parsePage(url, parsers.parseSemesterData);
};

const getCourseData = (semester, ids) => {
    const url = `http://eams.uestc.edu.cn/eams/courseTableForStd!courseTable.action?ignoreHead=1&setting.kind=std&startWeek=1&semester.id=${semester}&ids=${ids}`;
    return services.parsePage(url, parsers.parseCourseData);
};

const init = () => {
    return new Promise((resolve, reject) => {
        getBasicData.then(getSemesterData).then(res => {
            commonData.semester = res;
            resolve({
                commonData,
                getCourseData
            });
        });
    });
};

module.exports = init;