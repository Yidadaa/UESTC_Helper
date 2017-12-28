/**
 * @file 开课查询- 展示表格
 */
import React from 'react';
import { Table, Button, Tooltip, Icon } from 'antd';
import style from '../style.less';
import request from '../../../utils/request';

export default props => {
  const { showData, pageSize, totalCount,
    curPageNum, loading, dispatch, searchFields,
    selectKeys } = props;
  let config = [];
  const teacherDetailLink = 'http://eams.uestc.edu.cn/eams/publicSearch!download.action';
  // 用于下载教师简介的url
  if (showData && showData.length > 0) {
    const firstLine = showData[0];
    const widthDict = {
      '年级': 100,
      '职称': 100,
      '上课地点': 150
    }; // 设置width的时候，优先从widthDict中匹配，匹配不到就用默认值
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
            title: v, dataIndex: v, width: widthDict[v] || 200,
            render: val => val.map((l, index) => <div key={ index }>{ l }</div>)
          }
          break;
      
        default:
          rowConfig = {
            title: v,
            dataIndex: v,
            width: widthDict[v] || 150
          };
          break;
      }
      config.push(rowConfig);
    });
  }

  const noData = showData.length == 0 || Object.keys(showData[0]).length == 0;

  const rowSelection = {
    onChange: keys => {
      dispatch({
        type: 'queryCourse/updateStates',
        payload: {
          selectKeys: keys
        }
      });
    }
  };

  const onPageChange = (page, pageSize) => {
    dispatch({
      type: 'queryCourse/updateStates',
      payload: {
        curPageNum: page,
        pageSize: pageSize
      }
    });
    dispatch({
      type: 'queryCourse/search',
      payload: searchFields
    });
  };

  const pagination = {
    current: parseInt(curPageNum),
    total: parseInt(totalCount),
    pageSize: parseInt(pageSize),
    showSizeChanger: true,
    onChange: onPageChange,
    onShowSizeChange: onPageChange
  };

  const onDowloadBtnClick = () => {
    // 构造一个表单对象并提交，引发下载操作
    const url = 'http://eams.uestc.edu.cn/eams/courseOutlineDownload!downloadByLessonId.action';
    const form = document.createElement('form');
    form.style.display = 'none';
    [['lesson.ids', selectKeys.toString()], ['downFlag', true]].forEach(v => {
      const input = document.createElement('input');
      input.setAttribute('name', v[0]);
      input.setAttribute('value', v[1]);
      form.appendChild(input);
    });
    form.action = url;
    form.method = 'post';
    form.onsubmit = () => false;
    form.target = '_self';
    document.body.appendChild(form);
    form.submit();
  };

  const resIcon = loading ? 'loading' : 'info-circle' + (totalCount > 0 ? '' : '-o') ;
  const dlIcon = 'check-circle' + (selectKeys.length > 0 ? '' : '-o');

  const tableTitle = () => (
    <div className={ style.formTitle }>
      {
        showData && <span>
          <Icon type={resIcon} className={style.icon}/>
          共搜索到 {totalCount} 个结果
        </span>
      }
      <div className={ style.selectInfo }>
        <span className={ style.tip }>
          <Icon type={dlIcon} className={style.icon}/>
          已选中 { selectKeys.length } 个条目
        </span>
        <Button icon="download" disabled={ selectKeys.length === 0 }
          type='primary' onClick={ onDowloadBtnClick }>下载课程大纲</Button>
      </div>
    </div>
  );

  // 这里之所以把rowSelection拆出来
  // 是因为antd通过判断rowSelection字段是否有值来控制选择项的显示与否
  let tableConfig = {};
  if (!noData) tableConfig.rowSelection = rowSelection;

  return (<div className={ style.table }>
    <Table dataSource={ noData ? [] : showData } columns={ config } loading={ loading }
      pagination={ pagination } title={ tableTitle } {...tableConfig}/>
  </div>);
}