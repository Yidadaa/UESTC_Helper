/**
 * 一卡通页面
 */
import React from 'react';
import {connect} from 'dva';
import style from './style.less';

const Ecard = (props) => {
  return (
    <div>ecard</div>
  );
};

const mapStateToProps = ({ecard}) => {
  return {...ecard};
};

export default connect(mapStateToProps)(Ecard);