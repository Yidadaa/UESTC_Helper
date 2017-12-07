/**
 * 全校开课查询 - 数据解析模块
 */
import {parseTableData} from '../common/utils/parseTable';

const parseFormField = (sourceText) => {
  /**
   * @name 解析可选列表数据
   * @return {Object} 开课院系/上课院系/课程类别
   */
  const node = document.createElement('div');
  node.innerHTML = sourceText;
  const teachDepart = node.querySelector('[name="lesson.teachDepart.id"]'); // 开课院系
  const depart = node.querySelector('[name="limitGroup.depart.id"]'); // 上课院系
  const courseType = node.querySelector('[name="lesson.courseType.id"]'); // 课程类别
  const semesterID = node.querySelector('[name="semester.id"]'); // 课程类别
  const projectID = (node.querySelector('[name="lesson.project.id"]') || {}).value || '';
  const getOptions = (select) => {
    return select ? Array.from(select.options).map(option => {
      return {
        value: option.value,
        text: option.innerText
      };
    }).filter(v => isFinite(parseInt(v.value))) : []; // 筛选掉那三个点点
  };

  return {
    teachDepart: getOptions(teachDepart),
    depart: getOptions(depart),
    courseType: getOptions(courseType),
    projectID, semesterID: getOptions(semesterID)
  };
};

const parseResData = (sourceText) => {
  /**
   * @name 解析展现数据
   * @return 列表数据
   */
  const node = document.createElement('div');
  node.innerHTML = sourceText;
  const table = node.querySelector('table');
  if (!table) return null;
  const contentNS = table.children[1].children;
  const headNS = table.children[0].children[0].children;
  const tableHead = ['key'].concat(Array.from(headNS).map(v => v.innerText).slice(1));
  // TableHead的第一列是课程的数据库ID
  // console.log(tableHead);
  let tableContent = Array.from(contentNS).map(v => {
    const tds = Array.from(v.children);
    let tdData = {};
    tds.map((v, i) => {
      let content = v.innerHTML.replace(/\<br\>/g, ' ').replace(/[\n\t]/g, ' '); // 去除空格
      switch (i) {
        case 0:
          const regContent = content.match(/\d+/);
          content = regContent ? regContent[0] : content;
          break;
        case 5:
          let rowContent = v.innerHTML.replace(/\<br\>/g, ' ').replace(/\t/g, '').replace(/\n<f/g, '<f');
          const teachGroup = rowContent.split('\n');
          content = teachGroup.filter(val => val.replace(/s/g, '').length !== 0).map(val => {
            let teacherName = val.match(/(.*)<font/);
            let teacherNumber = val.match(/\((\d+)\)/);
            teacherName = teacherName ? teacherName[1] : '';
            teacherNumber = teacherNumber ? teacherNumber[1] : '';
            return [teacherName, teacherNumber];
          });
          break;
        case 6:
        case 8:
        case 9:
          content = v.innerHTML.replace(/\<br\>/g, '\n').replace(/\t/g, '')
            .split('\n').filter(val => val.replace(/s/g, '').length !== 0);
          break;
      }
      tdData[tableHead[i]] = content;
    });
    return tdData;
  });
  // 开始解析数据条目、总页数等信息
  const tableInfo = node.querySelector('.girdbar-pgbar');
  let pageInfo = sourceText.match(/\.pageInfo\((.*)\);/);
  pageInfo = pageInfo ? pageInfo[1].split(',') : [1, 20, 1];
  const [curPageNum, pageSize, totalCount] = pageInfo;
  return { tableContent, curPageNum, pageSize, totalCount };
}

export default {
  parseFormField,
  parseResData
};