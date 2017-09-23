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
  const tableHead = Array.from(headNS).map(v => v.innerText);
  const tableContent = Array.from(contentNS).map(v => {
    const tds = Array.from(v.children);
    let content = {};
    tds.map((v, i) => {
      content[tableHead[i]] = v.innerHTML;
    });
    return content;
  });
  console.log(tableContent, table);
  return tableContent;
}

export default {
  parseFormField,
  parseResData
};