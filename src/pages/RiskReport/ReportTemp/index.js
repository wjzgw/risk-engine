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
  Icon
} from 'antd';
import DropdownDetail from '@/components/DropdownDetail/DropdownDetail'
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
import router from 'umi/router';
// 验证权限的组件
import permission from '@/utils/PermissionWrapper';
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'

@permission
@connect(({ template, loading }) => ({
  template,
  loading: loading.effects['template/templateList']
}))
export default class VarList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
      {
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },
      {
        title: '报告名称',
        dataIndex: 'presentationName',
        key:'presentationName'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key:'createTime'
      },
      {
        title: '更新时间',
        key:'updateTime',
        dataIndex:'updateTime'
      },
      {
        title: '负责人',
        key:'createTrueName',
        dataIndex:'createTrueName'
      },
      {
        title: '操作',
        key:'action',
        render: (record) => {
          const { permission } =  this.props;
          const action = (
            <Menu>
              {
                permission.includes('re:reportTemplate:update')?
                <Menu.Item onClick={() => this.goAddPage(0,record.id)}>
                  <Icon type="edit"/>编辑
                </Menu.Item>:null
              }
              {
                permission.includes('re:reportTemplate:info')?
                <Menu.Item onClick={()=>this.goPreview(record.id)}>
                  <Icon type="zoom-in" />查看
                </Menu.Item>:null
              }
              {/* <Menu.Item onClick={()=>
                router.push({
                  pathname:'/policyManage/riskpolicylist/list'
                })}>
                <Icon type="delete"/>策略
              </Menu.Item> */}
                <Menu.Item onClick={()=>this.goRiskReport(record.id,record.presentationName)}>
                  <Icon type="unordered-list" />资产
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
          oneclass:'反欺诈',
          twoclass:'注册',
          varname:'注册时间',
          varcode:'变量代码',
          vartype:'变量类型',
          isenmu:'否',
          length:22,
          defVal:'男',
          max:88,
          min:11,
          enmuval:'男、女',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:0,//0:编辑  1：添加
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1
    };
  }
  async componentDidMount() {
   await this.props.dispatch({
      type: 'template/setQueryData',
      payload: {}
    })
    const {pageData} = this.props.template
    const {current} = pageData
    this.change(current)
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current: current,
      currentPage: current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    this.props.dispatch({
      type: 'template/templateList',
      payload: {
        ...this.props.template.queryData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  confirm=(e)=>{
    console.log(e);
    message.success('Click on Yes');
  }

  cancel=(e) =>{
    console.log(e);
    message.error('Click on No');
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  //监听子组件数据变化
  handleChildChange = (newState)=>{
    this.setState({
      modalStatus:newState
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
        <Button onClick={()=>this.goAddPage(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转编辑/新增页面
  goAddPage = (type=0,id='')=>{
    //this.props.dispatch(routerRedux.push({pathname:'/children/RiskManagement/VarList'}))
    router.push(`/riskReport/reportList/mould/edit?id=${id}&type=${type}`)
  }
  //去报告预览
  goPreview=(id)=>{
    router.push(`/riskReport/reportList/mould/preview?id=${id}`)
  }
  //去风控策略列表
  goPolicyList = ()=>{
    router.push({
      pathname:'/riskManage/riskpolicylist/list',
    })
  }
  //去风控报告列表
  goRiskReport = (id,presentationName)=>{
    router.push(`/riskReport/reportList/list?id=${id}&presentationName=${presentationName}`)
  }
  render() {
    const { templateList, pageData } = this.props.template
    const {current,total} = pageData
    const {permission} = this.props;
    return (
     <PageHeaderWrapper renderBtn={permission.includes('re:reportTemplate:add')?this.renderTitleBtn:null}>
       {
         permission.includes('re:reportTemplate:view')?
           <Card
             bordered={false}
             title="风控报告模板"
           >
             <FilterIpts getSubKey={this.getSubKey} change={this.onChange}/>
             <Table
               bordered
               pagination={false}
               columns={this.state.columns}
               dataSource={templateList}
               loading={this.props.loading}
             />
             <Pagination
               style={{ marginBottom: "50px" }}
               showQuickJumper
               defaultCurrent={1}
               current={current}
               total={total}
               onChange={this.onChange}
               showTotal={(total, range) => this.showTotal(total, range)}
             />
           </Card>:null
       }
      </PageHeaderWrapper>
    )
  }
}
