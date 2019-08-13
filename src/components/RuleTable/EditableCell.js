import React, { PureComponent, Fragment } from 'react';
import { 
  Button,
  Form,
  Popconfirm,
  Table,
  Select,
  Input,
  DatePicker
} from 'antd';
import { connect } from 'dva'
import moment from 'moment'
const dateFormat = 'YYYY-MM-DD'
const dateFormatTime = 'YYYY-MM-DD HH:mm:ss'
const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
  
  @Form.create()
  
  export default class EditableCell extends PureComponent {
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
      if(this.props.getSubKey){
        this.props.getSubKey(this,'editableCell')
      }
      if (this.props.handleModify) this.props.handleModify(this.props.form)
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
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
      console.log(value,record,type)
      record[type] = value
    }
  
    save = (name) => {
      const { record, handleSave } = this.props;
      this.props.form.validateFields([name],(error, values) => {
        console.log(error,values)
        if (error) {

          return;
        }
        this.toggleEdit();
        //handleSave({ ...record, ...values });
      });
    }
    //日历监听事件
    onDateChange=(date,record,type) =>{
      record[type]=moment(date).format(dateFormat)
    }
    //时间监听事件
    onTimeChange=(date,record,type)=>{
      console.log(date)
      record[type]=moment(date).format(dateFormatTime)
    }
    getInput = () => {
      if (this.props.type === 'select') {
        return <Select
          style={{width:'100%'}}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
        >
          {
            this.props.record['varType']==='num'?
            this.props.value&&this.props.value.map((item,index)=>{
              return (
                <Option value={item.id} key={index}>{item.name}</Option>
              )
            }):this.props.valueOther&&this.props.valueOther.map((item,index)=>{
              return (
                <Option value={item.id} key={index}>{item.name}</Option>
              )
            })
          }
        </Select>;
      }else if(this.props.type === 'input' && this.props.isFocus){
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          //onClick={(e)=>this.props.handleModify()}
          readOnly
        />;
      }else if(this.props.type==='more'){
        if(this.props.record['varType']==='num'){
          return <Input
            ref={node => (this.inputNum = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }else if(this.props.record['varType']==='char'&&!this.props.record['enumFlag']){
          return <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }else if(this.props.record['enumFlag']){
          return <Select
            style={{width:'100%'}}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e, this.props.record, this.props.dataIndex)}
          >
            {
              this.props.record['enumList']&&this.props.record['enumList'].map((item,index)=>{
                return (
                  <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
                )
              })
            }
          </Select>;
        }else if(this.props.record['varType'] ==='date'){
          return <DatePicker
                    onPressEnter={this.save}
                    style={{width:'100%'}}
                    onChange={(date)=>this.onDateChange(date,this.props.record,this.props.dataIndex)}
                  />
        }else if(this.props.record['varType'] ==='time'){
          return <DatePicker
                    showTime
                    onPressEnter={this.save}
                    style={{width:'100%'}}
                    onChange={(date)=>this.onTimeChange(date,this.props.record,this.props.dataIndex)}/>
        }else{
          return <Input
            ref={node => (this.input = node)}
            onPressEnter={this.save}
            onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
          />;
        }
      }else{
        return <Input
          ref={node => (this.input = node)}
          onPressEnter={this.save}
          onChange={(e) => this.changeHandler(e.target.value, this.props.record, this.props.dataIndex)}
        />;
      }
    };
    createFormItem = ()=>{
      const { getFieldDecorator } = this.props.form;
      const { type,dataIndex,cols,record,value,valueOther,pattern ,isFocus} = this.props;
      if(type === 'select'){
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
              initialValue: record[dataIndex]?record[dataIndex]:'',
            })(
              <Select
                style={{width:'100%'}}
                onPressEnter={this.save}
                onChange={(e) => this.changeHandler(e, record, dataIndex)}
              >
                {
                  record['varType']==='num'?
                    value&&value.map((item,index)=>{
                      return (
                        <Option value={item.id} key={index}>{item.name}</Option>
                      )
                    }):valueOther&&valueOther.map((item,index)=>{
                    return (
                      <Option value={item.id} key={index}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        )
      }else if(type === 'input' && isFocus){
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
              initialValue: record[dataIndex]?record[dataIndex]:'',
            })(
              <Input
                ref={node => (this.input = node)}
                onPressEnter={this.save}
                onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
                //onClick={(e)=>this.props.handleModify()}
                readOnly
              />
            )}
          </FormItem>
        )
      }else if(type==='more'){
        if(record['varType']==='num'){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
                rules:[
                  {
                    pattern:pattern,
                    message:'只能输入3位的数字!',
                  }
                ]
              })(
                <Input
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
                />
              )}
            </FormItem>
          )
        }else if(record['varType']==='char'&&!record['enumFlag']){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
              })(
                <Input
                  ref={node => (this.input = node)}
                  onPressEnter={this.save}
                  onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
                />
              )}
            </FormItem>
          )
        }else if(record['enumFlag']){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue: record[dataIndex]?record[dataIndex]:'',
              })(
                <Select
                  style={{width:'100%'}}
                  onPressEnter={this.save}
                  onChange={(e) => this.changeHandler(e, record, dataIndex)}
                >
                  {
                    record['enumList']&&record['enumList'].map((item,index)=>{
                      return (
                        <Option value={item.enumValue} key={index}>{item.enumValue}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
          )
        }else if(record['varType'] ==='date'){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue: moment(record[dataIndex]),
              })(
                <DatePicker
                  style={{width:'100%'}}
                  onChange={(date)=>this.onDateChange(date,record,dataIndex)}
                />
              )}
            </FormItem>
          )
        }else if(record['varType'] ==='time'){
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue: moment(record[dataIndex]),
              })(
                <DatePicker
                  showTime
                  style={{width:'100%'}}
                  onChange={(date)=>this.onTimeChange(date,record,dataIndex)}/>
              )}
            </FormItem>
          )
        }else{
          return(
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                initialValue:record[dataIndex],
                rules:[
                  {
                    required: true,
                    validator: (rule, value, callback) => {
                      if (!value) callback('命中标记不能为空')
                    }
                  }
                ]
              })(
                <Input
                  ref={node => (this.input = node)}
                  onPressEnter={this.save(`dataIndex${record['key']}${cols}`)}
                  onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
                  readOnly
                />
              )}
            </FormItem>
          )
        }
      }else{
        return(
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
              initialValue:record[dataIndex],
              rules:[
                {
                  required:true,
                  validator: (rule, value, callback) => {
                    if (!value) callback('命中标记不能为空')
                  }
                }
              ]
            })(
              <Input
                ref={node => (this.input = node)}
                onPressEnter={()=>this.save(`dataIndex${record['key']}${cols}`)}
                onChange={(e) => this.changeHandler(e.target.value, record, dataIndex)}
              />
            )}
          </FormItem>
        )
      }
    }
    formValidate=()=>{
      this.props.validateFields()
    }
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        cols,
        title,
        isRequired,
        pattern,
        record,
        max,
        index,
        handleSave,
        isFocus,
        handleModify,
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
                  this.createFormItem()
                )
                /*return (
                  <FormItem style={{ margin: 0 }}>
                    {getFieldDecorator(`dataIndex${record['key']}${cols}`, {
                      initialValue: (record['varType']==='date'||record['varType']==='time')&&dataIndex==='compareValue'?moment(record[dataIndex]):record[dataIndex]?record[dataIndex]:'',
                      rules:[
                        {
                          pattern:record['varType']==='num'?pattern:/^.*$/,
                          message:record['varType']==='num'?'只能输入3位的数字!':'',
                        }
                      ]
                    })(
                      this.getInput()
                    )}
                  </FormItem>
                );*/
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
  }