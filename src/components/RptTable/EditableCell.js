import React, { Component, Fragment } from 'react';
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Input
} from 'antd';
import { connect } from 'dva'
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
  
  @Form.create()
  
  export default class EditableCell extends Component {
    constructor(props){
      super(props)
      this.state = {
          editing: false,
      }
    }
  
    componentDidMount() {
      if (this.props.editable) {
        document.addEventListener('click', this.handleClickOutside, true);
      }
      if (this.props.handleModify) this.props.handleModify(this.props.form)
      console.log(this.props)
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
    componentDidUpdate(){
      if(this.props&&this.props.record&&this.props.dataIndex){
        const {record,dataIndex} = this.props;
        record[dataIndex]?record[dataIndex]=record[dataIndex]:record[dataIndex]=record['key']
      }
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }

    handleClickOutside = (e) => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
        this.save();
      }
    }
  
    changeHandler(value, record, type) {
      record[type] = value
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields((error, values) => {
        if (error) {

          return;
        }
        this.toggleEdit();
        //handleSave({ ...record, ...values });
      });
    }
    checkInput=(value, record, type)=>{
      this.props.form.validateFields([type],(error, values) => {
        //验证 1：不通过，2：通过
        if(error){
          record[type]='error'
        }else{
          record[type] = value
        }
      })
    }
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        noRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        ...restProps
      } = this.props;
      const { getFieldDecorator } = this.props.form;
      return (
        <td ref={node => (this.cell = node)}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `请填写正确的格式.`,
                        validator: async(rule, value, callback) => {
                          const reg = pattern;
                          if (!value&&!noRequired) callback('输入内容不能为空!')
                          if(pattern){
                            if(!reg.test(value)){
                              callback(`最多只能输入${max}位的数字!`)
                              return;
                            }
                          }
                        }
                      }],
                      initialValue: record[dataIndex]?record[dataIndex]:record['key'],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                        onChange={(e) => this.changeHandler(e.target.value, this.props.record, dataIndex)}
                      />
                    )}
                  </FormItem>
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }