/**
 * 全校开课查询
 */
import React from 'react';
import {connect} from 'dva';
import style from './style.less';

const QueryCourse = (props) => {
  return <div className={style.header}>
    <div className={style.title}>全校开课查询</div>
  </div>;
};

const mapStateToProps = ({queryCourse}) => {
  return {queryCourse};
};

export default connect(mapStateToProps)(QueryCourse);