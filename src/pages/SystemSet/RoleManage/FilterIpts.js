import React, { Component } from 'react'
import { 
  Row,
  Col,
  Input,
  Button,
  Select,
  Form
} from 'antd';
import styles from '../FilterIpts.less'
import { connect } from 'dva'
const Option = Select.Option;
const FormItem = Form.Item

@connect(({ role }) => ({
  role
}))

@Form.create()

export default class FilterIpts extends Component {
  //查询
  formSubmit = async (e) => {
    const formData = this.getFormValue();
    const { dispatch } =  this.props;
    await dispatch({
      type: 'role/setQueryConfig',
      payload: {
        ...formData
      }
    })
    this.props.change(1,this.props.pageSize)
  }
  //   获取表单信息
  getFormValue = () => {
    return this.props.form.getFieldsValue()
  }
  //重置
  reset = () => {
    this.props.form.resetFields()
  }
  componentDidMount () {
    this.props.getSubKey(this,'child')
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemConfig = {
      labelCol:{span:8},
      wrapperCol:{span:16},
    }
    return (
      <Form
        className="ant-advanced-search-form"
      >
        <Row className={styles.btmMargin}  type="flex" align="middle">
          <Col xxl={4} md={6}>
            <FormItem label="角色名称" {...formItemConfig}>
              {getFieldDecorator('status')(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col xxl={4} md={6}>
            <FormItem label="角色状态" {...formItemConfig}>
              {getFieldDecorator('assetsTypeCode')(
                <Select allowClear={true}>
                  <Option value={1}>启用</Option>
                  <Option value={2}>禁用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className={styles.registBtn} xxl={{ span: 4}} md={{ span: 6}} offset={1}>
            <Button type="primary" onClick={this.formSubmit}>查询</Button>
            <Button type="primary" onClick={this.reset}>清空</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
