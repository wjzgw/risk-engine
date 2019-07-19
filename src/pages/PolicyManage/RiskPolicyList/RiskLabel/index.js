import React, { PureComponent, Fragment } from 'react';
import PageTableTitle from '@/components/PageTitle/PageTableTitle'
import {
  Button,
  Table,
  Pagination,
  Popconfirm,
  message,
  Modal,
  Icon
} from 'antd';
import LabelEdit from './LabelEdit';
import { connect } from 'dva'
import { routerRedux } from 'dva/router';
// 验证权限的组件
import FilterIpts from './FilterIpts';
import { findInArr,exportJudgment } from '@/utils/utils'
import router from 'umi/router';

@connect(({ assetDeploy, loading }) => ({
  assetDeploy,
  loading: loading.effects['assetDeploy/riskSubmit']
}))
export default class RiskLabel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [{
        title: '序号',
        dataIndex: 'key',
        key:'key'
      },{
        title: '标签名称',
        dataIndex: 'labelName',
        key:'labelName'
      },
        {
          title:'标签内容',
          dataIndex:'labelCont',
          key:'labelCont'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key:'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key:'updateTime'
        },
        {
          title: '负责人',
          dataIndex: 'responser',
          key:'responser'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key:'status'
        },
      {
        title: '操作',
        key:'action',
        render: (record) => (
          <div style={{color:'#6BC7FF',cursor:'pointer'}}>
            <span onClick={()=>this.goAddEdit(2)}>编辑</span>
            <Popconfirm
              title="是否确认删除该策略？"
              onConfirm={this.confirm}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <span style={{paddingLeft:10,paddingRight:10}}>删除</span>
            </Popconfirm>
          </div>
        )
      }],
      data:[
        {
          key:1,
          labelName:'壹钱包房抵贷',
          labelCont:'<资产来源：极速云> <资产类型：个人经营贷><期限：12月>',
          createTime:'2018-06-06',
          updateTime:'2018-06-06',
          responser:'王大大',
          status:'启用',
        }
      ],
      checkedData: [],
      modalStatus:false,
      code:'',
      type:1,//1：新增，2：编辑
      pageSize:10,
      currentPage:1,
      current:1,
      id:'',
      status:1,
      visible:false
    };
  }
  componentDidMount() {
    this.change();
  }
  //  分页器改变页数的时候执行的方法
  onChange = (current) => {
    this.setState({
      current:current,
      currentPage:current
    })
    this.change(current)
  }
  // 进入页面去请求页面数据
  change = (currPage = 1, pageSize = 10) => {
    let formData ;
    if(this.child){
      formData = this.child.getFormValue()
    }else{
      formData = {}
    }
    this.props.dispatch({
      type: 'assetDeploy/riskSubmit',
      data: {
        ...formData,
        currPage,
        pageSize
      }
    })
    // this.refs.paginationTable && this.refs.paginationTable.setPagiWidth()
  }
  //   获取子组件数据的方法
  getSubKey=(ref,key)=>{
    this[key] = ref;
  }
  //展示页码
  showTotal = (total, range) => {
    return <span style={{ fontSize: '12px', color: '#ccc' }}>{`显示第${range[0]}至第${range[1]}项结果，共 ${total}项`}</span>
  }
  confirm=(e)=>{
    console.log(e);
    message.success('Click on Yes');
  }

  cancel=(e) =>{
    console.log(e);
    message.error('Click on No');
  }
  //点击配置弹窗
  clickDialog=(record)=>{
    this.childDeploy.reset()
    this.setState({
      modalStatus:true,
      assetsTypeName:record.assetsTypeName,
      code:record.assetsTypeCode,
      id:record.id,
      status:record.status,
      type:false
    })
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
        <Button onClick={()=>this.goAddEdit(1)}><Icon type="plus" theme="outlined" />新增</Button>
      </Fragment>
    )
  }
  //跳转新增/编辑页面
  goAddEdit=(type)=>{
    router.push({
      pathname:'/policyManage/riskpolicylist/risklabel/edit',
      query:{
        type:type,
      }
    })
  }
  render() {
    return (
     <PageTableTitle title={'风控标签'} renderBtn={this.renderTitleBtn}>
        <FilterIpts getSubKey={this.getSubKey} change={this.onChange} current={this.state.currentPage} changeDefault={this.changeDefault}/>
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
          total={20}
          onChange={this.onChange}
          showTotal={(total, range) => this.showTotal(total, range)}
        />
      </PageTableTitle>
    )
  }
}
