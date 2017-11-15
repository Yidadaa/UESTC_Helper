/**
 * 全校开课查询
 */
import React from 'react';
import {connect} from 'dva';
import style from './style.less';
import FormField from './components/FormField.jsx';
import FormContent from './components/FormContent.jsx';

const QueryCourse = (props) => {
  const {dispatch, courseType, depart, teachDepart,
    showAdvancedOptions, searchFields, showData}= props;
  return <div>
    <div className={style.header}>
      <div className={style.title}>全校开课查询</div>
    </div>
    <div className={style.formField}>
      <FormField {...{courseType, depart, teachDepart, dispatch,
        showAdvancedOptions, searchFields}}></FormField>
    </div>
    <div className={style.FormContent}>
      <FormContent {...{ showData }}/>
    </div>
  </div>;
};

const mapStateToProps = ({queryCourse}) => {
  return {...queryCourse};
};

export default connect(mapStateToProps)(QueryCourse);