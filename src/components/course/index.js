import React from 'react';
import {connect} from 'dva';
import {Menu} from 'antd';
import curSemYear from '../../utils/getCurSemYear';

import CourseTable from './components/CourseTable.jsx';
import ExamTable from './components/ExamTable.jsx';

require('./style.less');
// require('./fonts/style.less');

const Course = (props) => {
  const {
    common, semester, basicData,
    course, detailIndex, studyYears,
    courseLoading, examLoading, examData
  } = props;
  const {admissionYear} = common;
  const dispatch = props.dispatch;
  const menuConfig = {
    onClick: (e) => {
      dispatch({
        type: 'course/loadCourseData',
        payload: {
          semesterNum: e.key // 把要加载的学年索引发过去
        }
      });
    },
    mode: 'horizontal',
    selectedKeys: [detailIndex.toString()]
  };
  const numDict = ['一', '二', '三', '四'];
  const semDict = ['上', '下'];

  let name = `大${numDict[curSemYear.year - admissionYear]}${semDict[curSemYear.semesterIndex]}`;
  studyYears.some(v => {
    if (v.index.toString() === detailIndex) {
      name = v.name;
    }
    return v.index.toString() === detailIndex;
  }); // 找出当前学年对应的学期

  return (
    <div>
      <div className="course-header">
        <div className="course-title">{`${name}学期课程表`}</div>
        <div className="detail-menu">
          <Menu {...menuConfig}>
            {studyYears.map((v, i) => {
              return (
                <Menu.Item key={v.index}>{v.name}</Menu.Item>
              );
            })}
          </Menu>
        </div>
      </div>
      <CourseTable course={course} loading={courseLoading}></CourseTable>
      <div className="course-header">
        <div className="course-title exam-title">{`${name}学期考试安排`}</div>
      </div>
      <ExamTable exam={examData} isLoading={examLoading}/>
    </div>
  );
}

function mapStateToProps ({course, common}) {
  return {...course, common};
}
module.exports = connect(mapStateToProps)(Course);