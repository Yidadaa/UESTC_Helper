/**
 * @file 开课查询- 展示表格
 */
import React from 'react';
import { Table } from 'antd';

export default props => {
  const { showData } = props;
  const config = [{
    title: '选择',
    dataIndex: '课程名称'
  }];
  return (<Table dataSource={ showData } columns={ config }/>);
}