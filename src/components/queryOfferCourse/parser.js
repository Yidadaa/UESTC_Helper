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
  const getOptions = (select) => {
    return Array.from(select.options).map(option => {
      return {
        value: option.value,
        text: option.innerText
      };
    });
  };

  return {
    teachDepart: getOptions(teachDepart),
    depart: getOptions(depart),
    courseType: getOptions(courseType)
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
  const tableContent = parseTableData(table);
}

export default {
  parseFormField,
  parseResData
};