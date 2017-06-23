/**
 * 获取当前的学年信息
 * @param null
 * @return Object
 *    -> year 当前年份
 *    -> semesterIndex 当前学年，3-8月份是前半年，其他是后半年
 */
export default (() => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const semesterIndex = month >= 2 && month < 8 ? 0 : 1;

  return {
    year, semesterIndex
  };
})();