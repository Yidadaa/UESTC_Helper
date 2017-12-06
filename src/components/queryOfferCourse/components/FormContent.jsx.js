/**
 * @file 开课查询- 展示表格
 */
import React from 'react';
import { Table, Button } from 'antd';
import style from '../style.less';

export default props => {
  const { showData } = props;
  let config = [];
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
            render: val => <a href='#'>{ val }</a>,
            width: 150
          };
          break;

        case '课程序号':
        case '课程名称':
          rowConfig = {
            title: v, dataIndex: v,
            fixed: 'left'
          };
      
        default:
          rowConfig = {
            title: v,
            dataIndex: v,
            width: 250
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