import * as api from '@/services/PolicyManage/RiskPolicyList/PolicyFlowList/PolicyFlowEdit';
import { addListKey } from '@/utils/utils'
import { routerRedux } from 'dva/router';
import { notification,message} from 'antd'

export default {
  namespace: 'rule',

  state: {
    ruleList:[],
    page:{
      currentPage:1,
      more:true,
      pageSize:10,
      totalNum:10,
      totalPage:1
    },
  },

  effects: {
    //简单规则节点信息查询
    *queryRuleInfo(payload, { call, put }) {
      let response = yield call(api.queryRuleInfo,payload)
      if(response && response.status === '000000'){
        /*yield put({
          type:'riskListHandle',
          payload:response
        })*/
      }
    },
    //简单规则节点信息保存
    *saveRuleInfo({payload,callback},{call,put}){
      let response = yield call(api.saveRuleInfo,payload)
      if(response&&response.status == '000000'){
        message.success(response.statusDesc)
        callback()
      }else{
        message.error(response.statusDesc)
      }
    },
  },

  reducers: {
    ruleListHandle(state,{payload}){
      console.log('payload',payload)
      return {
        ...state,
        ruleList:payload.ruleList,
      }
    },
  },
};





