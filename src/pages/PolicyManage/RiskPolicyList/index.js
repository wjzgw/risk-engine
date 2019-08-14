import React, { PureComponent, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  Menu,
  Dropdown,
  message,
  Card,
  Icon,
  Modal
} from 'antd';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
//   新增编辑组件
import PolicyEdit from './PolicyEdit'
import { findInArr,exportJudgment } from '@/utils/utils'

@connect(({ policyList, loading }) => ({
  policyList,
  loading: loading.effects['policyList/fetchPolicyList']
}))
export default class RiskPolicyList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '策略类型',
        dataIndex: 'policyType',
        key:'policyType'
      },{
        title: '策略名称',
        dataIndex: 'policyName',
        key:'policyName'
      },{
        title: '策略代码',
        key:'policyCode',
        dataIndex:'policyCode'
      },{
        title: '策略说明',
        key:'policyExplain',
        dataIndex:'policyExplain'
      },{
        title: '输出报告',
        key:'creatTime',
        dataIndex:'creatTime'
      },{
        title: '状态',
        key:'status',
        dataIndex:'status',
        render: record => record === 1 ? '启用' : '禁用'
      },{
        title: '负责人',
        key:'leader',
        dataIndex:'leader'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const action = (
            <Menu>
              <Menu.Item onClick={this.goDeploy}>
                <Icon type="setting" />变量设置
              </Menu.Item>
              <Menu.Item onClick={this.goLabel}>
                <Icon type="snippets" />标签
              </Menu.Item>
              <Menu.Item onClick={()=>this.goEditPage(2)}>
                <Icon type="edit"/>编辑
              </Menu.Item>
              <Menu.Item onClick={()=>this.goPolicyFlowList()}>
                <Icon type="diff" />策略流
              </Menu.Item>
            </Menu>
          )
          return (
            <Dropdown overlay={action}>
              <a className="ant-dropdown-link" href="#">
                操作<Icon type="down"/>
              </a>
            </Dropdown>
          )
        }
      }],
      data:[
        {
          key:1,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          policyExplain:'适用于信用贷',
          outreport:'信用贷最牛报告',
          status:1,
          leader:'王大大',
        },
        {
          key:2,
          policyType:'主策略',
          policyName:'信贷最牛策略',
          policyCode:'best',
          policyExplain:'适用于信用贷',
          outreport:'信用贷最牛报告',
          status:0,
          leader:'王大大',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1:新增，2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status: 1,
      modalVisible: false,   //   新增策略状态
    };
  }
  componentDidMount() {
    //this.change()
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    console.log(current, 'change')
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    // let formData ;
    // if(this.child){
    //   formData = this.child.getFormValue()
    // }else{
    //   formData = {}
    // }
    let formData = this.props.policyList.queryData
    this.props.dispatch({
      type: 'policyList/fetchPolicyList',
      payload: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey = (ref, key) => {
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //去编辑页面
  goEditPage=(type)=>{
    // router.push({
    //   pathname:'/policyManage/riskpolicylist/list/edit',
    //   state:{
    //     type:type
    //   }
    // })
    this.setState({
      modalVisible: true
    })
  }
  //去输入输出配置
  goDeploy=()=>{
    router.push({
      pathname:'/policyManage/riskpolicylist/list/deploy'
    })
  }
  //  刷新页面
  reload = () => {
    window.location.reload();
  }
  //查询时改变默认页数
  changeDefault=(value)=>{
    this.setState({
      current:value
    })
  }
  //右上角渲染
  renderTitleBtn = () => {
    return (
      <Fragment>
        <Button onClick={()=>this.goEditPage(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转风控标签页面
  goLabel = () =>{
    router.push({
      pathname:'/policyManage/riskpolicylist/risklabel',
    })
  }
  //跳转策略流列表
  goPolicyFlowList=()=>{
    router.push({
      pathname:'/policyManage/riskpolicylist/policyFlow/list'
    })
  }
  //   确定添加修改
  confirmChange = () => {
    console.log(this.edit.props.form.getFieldsValue())
  }
  render() {
    return (
     <PageHeaderWrapper  renderBtn={this.renderTitleBtn}>
         <Card bordered={false}>
           <FilterIpts getSubKey={this.getSubKey} change={this.change} pageSize={this.state.pageSize} changeDefault={this.changeDefault}/>
           <Table
             bordered
             pagination={false}
             columns={this.state.columns}
             dataSource={this.state.data}
             loading={this.props.loading}
           />
           <Pagination
             style={{ marginBottom: "50px" }}
             showQuickJumper
             defaultCurrent={1}
             current={this.state.current}
             total={100}
             onChange={this.onChange}
             showTotal={(total, range) => this.showTotal(total, range)}
           />
         </Card>
        <Modal
          visible={this.state.modalVisible}
          onOk={this.confirmChange}
          destroyOnClose={true}
          onCancel={() => this.setState({ modalVisible: false })}
          width={550}
          title={'新增策略'}
          bodyStyle={{ maxHeight: 470, overflow: 'auto' }}
        >
          <PolicyEdit returnSubKey={this.getSubKey} />
        </Modal>
      </PageHeaderWrapper>
    )
  }
}