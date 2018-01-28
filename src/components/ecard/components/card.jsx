/**
 * @file 一卡通 - 卡片信息
 * @desc 用于展示饭卡详细信息
 */

import React from 'react';
import style from './style.less';

export default props => {
  return (<div className={ style.stuCard }>
    <div className={ style.cardIcon }>
      <p className={ style.iconContent }>UESTC</p>
      <p className={ style.iconTitle }>求真求实 · 大气大为</p>
    </div>
    <div className={ style.stuNum }>
      <span className={ style.cardNum }>
        2014
      </span>
      <span className={ style.cardNum }>
        000
      </span>
      <span className={ style.cardNum }>
        201
      </span>
      <span className={ style.cardNum }>
        010
      </span>
    </div>
    <div className={ style.cardRow }>
      <div className={ style.cardInfo }>
        <div className={ style.title }>Name</div>
        <div className={ style.content }>张翼飞</div>
      </div>
      <div className={ style.cardInfo }>
        <div className={ style.title }>State</div>
        <div className={ style.content }>正常</div>
      </div>
      <div className={ style.cardInfo }>
        <div className={ style.title }>Date</div>
        <div className={ style.content }>2018-12-12</div>
      </div>
      <div className={ style.cardInfo }>
        <div className={ style.title }>ID</div>
        <div className={ style.content }>2435453</div>
      </div>
    </div>
  </div>);
}