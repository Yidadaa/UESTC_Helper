const React = require('react');
const func = require('./handle');
const CourseTable = require('./components/CourseTable.jsx');
import {connect} from 'dva';
import {Menu} from 'antd';
import curSemYear from '../../utils/getCurSemYear';

require('./style.less');
// require('./fonts/style.less');

const Course = (props) => {
  const {common, semester, basicData, course, detailIndex, studyYears, loading} = props;
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
      <CourseTable course={course} loading={loading}></CourseTable>
    </div>
  );
}

function mapStateToProps ({course, common}) {
  return {...course, common};
}
module.exports = connect(mapStateToProps)(Course);