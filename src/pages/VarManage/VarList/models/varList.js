import * as api from '@/services/VarManage/VarList';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'varlist',

  state: {
    varList:[],
    filterIpts:{},
    selectItem:[],
    secondSelectItem:[],
    count:'',
    enumeration:[],//枚举数组
    total:100,//一共多少项
    currentPage:1,
    current:1,//页数
  },

  effects: {
    //获取变量列表
    *fetchVarList({payload}, { call, put }) {
      let response = yield call(api.queryVarList,payload)
      if(response.status && response.status==1){
        yield put({
          type: 'saveVarList',
          payload:response,
        });
        yield put({
          type: 'savetotal',
          payload:response,
        });
      }
      return response;
    },
     *getSelectLevel1({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel1,payload)
      if(response.status && response.status==1){
        yield put({
          type: 'changeSelect',
          payload:response,
        });
      }
      return response;
    },
    *getSelectLevel2({payload}, { call, put }) {
      let response = yield call(api.getSelectLevel2,payload)
      if(response.status && response.status==1){
        yield put({
          type: 'changeSecondSelect',
          payload:response,
        });
      }
      return response;
    },
    //提交编辑变量
    *updateVariable({payload}, { call, put }) {
      let response = yield call(api.updateVariable,payload)
      return response;
    },
    *selectVariableById({payload}, { call, put }) {
      let response = yield call(api.selectVariableById,payload)
      return response;
    },
    //添加变量
    *addVar({payload,callback},{call,put}){
      let response = yield call(api.addVar,payload)
      return response;
    },
    //删除变量
    *delVar({payload},{call,put}){
      let response = yield call(api.delVar,payload)
      return response;
    },
    //应用策略
    *getStrategy({payload},{call,put}){
      let response = yield call(api.getStrategy,payload)
      return response;
    },
    *getEnumeration({payload},{call,put}){
      let response = yield call(api.getEnumeration,payload)
      yield put({
        type: 'saveEnumeration',
        payload,
      });
    },
    //校验变量名称唯一性
    *checkVarName({payload,callback},{call,put}){
      let response = yield call(api.checkVarName,payload)
      return response;
    },
    *checkVarCode({payload,callback},{call,put}){
      let response = yield call(api.checkVarCode,payload)
      return response;
    },
  },

  reducers: {
    saveVarList(state, { payload }) {
    	const list = addListKey (payload.data.records,payload.data.current,10)
      return {
        ...state,
        varList:list,
      }
    },
    savetotal(state, { payload }) {
      return {
        ...state,
        total:payload.data.total,
      }
    },
    changeSelect(state, { payload }) {
      return {
        ...state,
        selectItem: payload.data,
      };
    },
    changeSecondSelect(state, { payload }) {
      return {
        ...state,
        secondSelectItem: payload.data,
      };
    },
    changefilterIpts(state,{payload}) {
    	 return {
    	 	...state,
    	  filterIpts:payload
    	}
    },
    saveEnumeration(state,{payload}) {
    	 return {
    	 	...state,
         enumeration:addListKey(payload)
    	}
    },
    changeCurrent(state,{payload}) {
      return {
        ...state,
        current:payload.current
     }
   },
   //清空选择
   clearfilterIpts(state,{payload}) {
      return {
        ...state,
      filterIpts:{},
      current:1,
      enumeration:[]
      }
    },
    //   枚举添加
    addData(state, { payload }) {
      return {
        ...state,
        enumeration: addListKey(payload)
      }
    }
  },
};





