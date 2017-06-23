/**
 * @file 课程表
 * @desc 课程表渲染界面
 */
const React = require('react');
const Spin = require('antd/lib/spin');
const CourseItem = require('./CourseItem.jsx');

module.exports = props => {
  const courses = new Array(7).fill([]);
  props.course.forEach(v => {
    let index = v.time[0][0];
    courses[index] = courses[index].concat(v);
  });
  const isLoading = props.course.length === 0;

  return (
    <Spin spinning={isLoading} tip="加载中...">
      <div id="course-table">
        {courses.map((v, i)=> {
          return <CourseItem key={i} courses={v} today={i}></CourseItem>;
        })}
      </div>
    </Spin>
  );
};