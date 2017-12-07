/**
 * @file 开课查询- 展示表格
 */
import React from 'react';
import { Table, Button, Tooltip } from 'antd';
import style from '../style.less';

export default props => {
  const { showData } = props;
  let config = [];
  const teacherDetailLink = 'http://eams.uestc.edu.cn/eams/publicSearch!download.action';
  // 用于下载教师简介的url
  if (showData && showData.length > 0) {
    const firstLine = showData[0];
    Object.keys(firstLine).slice(1).forEach(v => {
      // 这里的slice(1)，是因为解析到的table第一列为id
      let rowConfig;
      switch (v) {
        case '教师':
          rowConfig = {
            title: v,
            dataIndex: v,
            render: val => val.map((teacher, index) => {
              const href = `${teacherDetailLink}?teacher.code=${teacher[1]}`;
            return (<Tooltip title={ `下载 ${teacher[0]} 简介` } key={ index }>
              <a href={ href } className={ style.teacherName }>{ teacher[0] }</a>
            </Tooltip>);
            }),
            width: 100
          };
          break;

        case '职称':
        case '上课时间':
        case '上课地点':
          rowConfig = {
            title: v, dataIndex: v, width: 200,
            render: val => val.map((l, index) => <div key={ index }>{ l }</div>)
          }
          break;
      
        default:
          rowConfig = {
            title: v,
            dataIndex: v,
            width: 150
          };
          break;
      }
      config.push(rowConfig);
    });
  }
  const rowSelection = {
    onChange: () => {}
  };
  return (<div>
    <div className={ style.formTitle }>
      {
        showData && <span>共搜索到 {showData.length} 个结果</span>
      }
      <Button icon="download">下载课程大纲</Button>
    </div>
    <Table dataSource={ showData } columns={ config } rowSelection={ rowSelection }/>
  </div>);
}