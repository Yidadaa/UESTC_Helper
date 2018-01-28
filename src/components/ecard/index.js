/**
 * 一卡通页面
 */
import React from 'react';
import { connect } from 'dva';
import style from './style.less';
import StuCard from './components/card';

const Ecard = (props) => {
  return (
    <div>
      <div className="course-header">
        <div className={ 'course-title ' + style.ecardTitle }>
          一卡通消费总览
        </div>
      </div>
      <div className={ style.head }>
        <div className={ style.headLeft }>
          <StuCard />
        </div>
        <div className={ style.headRow }>
          <div className={ style.headBlock }>
            <span className={ style.headTitle }>余额</span>
            <span className={ style.headContent }>12.2</span>
          </div>
          <div className={ style.headBlock }>
            <span className={ style.headTitle }>待领取</span>
            <span className={ style.headContent }>100.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ecard}) => {
  return {...ecard};
};

export default connect(mapStateToProps)(Ecard);