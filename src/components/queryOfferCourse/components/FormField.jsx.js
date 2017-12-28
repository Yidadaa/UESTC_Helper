/**
 * @file 开课查询 - 搜索条件
 * @desc 包括基础搜索，高搜索
 */
import React from 'react'
import { Form, Row, Col, Input, Button,
  Icon, Select, Radio, Switch, Tooltip,
  DatePicker} from 'antd';
import style from '../style.less';
import _ from 'underscore';
const FormItem = Form.Item
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const onSearch = (props, fields) => {
  // 每当表单中的值发生变化时，就执行一遍搜索函数
  let hasErrors = false;
  const {dispatch, searchFields} = props;
  let newSearchFields = Object.assign({}, searchFields);
  Object.keys(fields).map(v => {
    const field = fields[v];
    newSearchFields[v] = field.value; // 更新搜索项中对应的值
    if (field.value == -1 || !field.value) {
      // -1代表着无效值，应当舍弃
      delete newSearchFields[v];
    }
    hasErrors = hasErrors || field.errors; // 判断是否有错误发生
  });
  dispatch({
    type: 'queryCourse/updateFields',
    payload: {
      searchFields: newSearchFields
    }
  });
  if (hasErrors) return null; // 如果报错，就不进行搜索，只更新字段
  dispatch({
    type: 'queryCourse/search',
    payload: newSearchFields
  });
};

export default Form.create({onFieldsChange: _.debounce(onSearch, 500)})((props) => {
  const {getFieldDecorator, resetFields} = props.form;
  const {courseType, depart, teachDepart,
    dispatch, showAdvancedOptions, searchFields} = props;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const specLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 21 },
    },
  };
  const defaultYear = new Date().getFullYear();
  const togglePanel = () => {
    dispatch({
      type: 'queryCourse/updateStates',
      payload: {
        showAdvancedOptions: !showAdvancedOptions
      }
    });
  };
  return (
    <Form>
      <div className={style.basicField}>
        <Row>
          <Col span={8}><FormItem {...formItemLayout} label='课程名称'> 
            {getFieldDecorator('lesson.course.name')(
              <Input placeholder='例如：知味'></Input>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="授课教师">
            {getFieldDecorator('teacher.name')(
              <Input placeholder='例如：杨宏春'></Input>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="开课院系">
            {getFieldDecorator('lesson.teachDepart.id')(
              <Select showSearch placeholder='选择开课学院' optionFilterProp='children'>
                {teachDepart.map(v => {
                  return <Option value={v.value} key={v.value}>{v.text}</Option>
                })}
              </Select>
            )}
          </FormItem></Col>
        </Row>
        <Row>
          <Col span={8}><FormItem {...formItemLayout} label='开课年级'> 
            {getFieldDecorator('limitGroup.grade', {
              rules: [{pattern: /\d{4}/, message: '年级至少为四位数'}]
            })(
              <Input placeholder={`例如：${defaultYear}`}></Input>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="上课校区">
            {getFieldDecorator('lesson.campus.id', {initialValue: -1})(
              <RadioGroup>
                <RadioButton value={-1}>全选</RadioButton> 
                <RadioButton value={2}>清水河</RadioButton>
                <RadioButton value={3}>沙河</RadioButton>
              </RadioGroup>
            )}
          </FormItem></Col>
        </Row>
      </div>
      {showAdvancedOptions && <div className={style.advancedField}>
        <Row>
          <Col span={8}><FormItem {...formItemLayout} label='课程序号'> 
            {getFieldDecorator('lesson.no')(
              <Input placeholder='例如：A0209720.02'></Input>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="课程类别">
            {getFieldDecorator('lesson.courseType.id')(
              <Select showSearch placeholder='选择课程类别' optionFilterProp='children'>
                {courseType.map(v => {
                  return <Option value={v.value} key={v.value}>{v.text}</Option>
                })}
              </Select>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="上课院系">
            {getFieldDecorator('limitGroup.depart.id')(
              <Select showSearch placeholder='选择上课学院' optionFilterProp='children'>
                {depart.map(v => {
                  return <Option value={v.value} key={v.value}>{v.text}</Option>
                })}
              </Select>
            )}
          </FormItem></Col>
        </Row>
        <Row>
          <Col span={8} offset={0}><FormItem {...formItemLayout} label="日期范围">
            {getFieldDecorator('rangeWeek')(
              <RangePicker renderExtraFooter={() => '搜索指定日期范围内的课程'}></RangePicker>
            )}
          </FormItem></Col>
          <Col span={16} offset={0}><FormItem {...specLayout} label="考试类型">
            {getFieldDecorator('examType.id', {initialValue: -1})(
              <RadioGroup>
                <RadioButton value={-1}>全选</RadioButton>
                <RadioButton value={2}>期中考试</RadioButton>
                <RadioButton value={1}>期末考试</RadioButton>
                <RadioButton value={3}>补考</RadioButton>
                <RadioButton value={4}>缓考</RadioButton>
              </RadioGroup>
            )}
          </FormItem></Col>
        </Row>
        <Row>
          <Col span={16} offset={0}><FormItem {...specLayout} label="周几上课">
            {getFieldDecorator('fake.time.weekday', {initialValue: -1})(
              <RadioGroup>
                <RadioButton value={-1}>全选</RadioButton>
                <RadioButton value={1}>周一</RadioButton>
                <RadioButton value={2}>周二</RadioButton>
                <RadioButton value={3}>周三</RadioButton>
                <RadioButton value={4}>周四</RadioButton>
                <RadioButton value={5}>周五</RadioButton>
                <RadioButton value={6}>周六</RadioButton>
                <RadioButton value={7}>周日</RadioButton>
              </RadioGroup>
            )}
          </FormItem></Col>
          <Col span={8} offset={0}>
            <FormItem {...formItemLayout} label="教师为空">
              {getFieldDecorator('fake.teacher.null', {valuePropName: 'checked'})(
                <Switch checkedChildren='是' unCheckedChildren='否'></Switch>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>}
      <div className={style.toggleBtn}>
        <a onClick={() => resetFields()} className={style.clearBtn}>
          <Icon type='reload'></Icon>
          {' 清空所有条件项'}
        </a>
        <a onClick={togglePanel}>
          <Icon type={showAdvancedOptions ? 'up' : 'down'}></Icon>
          {showAdvancedOptions ? ' 收起' : ' 展开'}高级搜索
        </a>
      </div>
    </Form>
  )
})
