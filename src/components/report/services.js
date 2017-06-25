/**
 * @用于从服务器获取成绩的原始数据
 */
import parser from './parser';
import services from '../../services/services';

async function getGradeData() {
  const url = 'http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR';
  const resText = await services.parsePage(url);
  const res = parser(resText);
  return res;
}

export default {getGradeData};