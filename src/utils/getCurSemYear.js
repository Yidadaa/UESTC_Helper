/**
 * 获取当前的学年信息
 * @param null
 * @return Object
 *    -> year 当前年份
 *    -> semesterIndex 当前学年，3-8月份是后半学年，其他是前半学年
 *    -> 注意，学年和自然年正好相差半年，信息门户的逻辑是：假设学生
 *       2014年入学，那么2014-0表示大一上学期（自然年对应2014-9月份）
 *       2014-1表示大一下学期（对应自然年2015-2月份），所以如果当前
 *       时间是2017年9月，那么对应的学年代号就是2017-0，如果当前时间
 *       是2018年2月，那么对应的学年代号就是2017-1
 */
export default (() => {
  const date = new Date();
  const year = date.getFullYear(); // 获取当前年份
  const month = date.getMonth() + 1; // 获取当前月份
  let semesterIndex = 0;
  let stuYear = year;
  if (month >= 1 && month <= 7) {
    semesterIndex = 1;
    stuYear -= 1;
  }
  return {
    year: stuYear,
    semesterIndex
  };
})();