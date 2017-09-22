/**
 * 一卡通页面
 */
import React from 'react';
import {connect} from 'dva';
import style from './style.less';

const Ecard = (props) => {
  return (
    <div>
      ecard
      <iframe src="" frameborder="0">
        这里放一个iframe用来处理跨域的事情，
        在package.json里面加一个js文件。
      </iframe>
    </div>
  );
};

const mapStateToProps = ({ecard}) => {
  return {...ecard};
};

export default connect(mapStateToProps)(Ecard);