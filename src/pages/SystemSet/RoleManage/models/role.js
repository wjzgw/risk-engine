import * as api from '../services';
import { addListKey } from '@/utils/utils'
export default {
  namespace: 'role',

  state: {
    dataList: [],//角色列表
    queryConfig: {},
    infoData: {}
  },

  effects: {
    //获取角色列表
    *fetchList({payload}, { call, put }) {
      let response = yield call(api.queryList,payload);
      if(response && response.status == 1) {
        response.data.records = addListKey(response.data.records, payload.currPage, payload.pageSize)
        yield put({
          type: 'saveList',
          payload: response.data
        });
      }
      
    },
    // 获取初始化数据
    *fetchInitData({ payload }, { call, put }) {
      let response = yield call(api.initData,payload);
      if(response && response.status == 1) {
        yield put({
          type: 'saveInitData',
          payload: response.data
        })
      }
    },
    //添加角色
    *addRole({ payload },{ call,put }){
      return yield call(api.addRole, payload)
    },
    //编辑角色
    *updateRole({ payload },{ call,put }){
      return yield call(api.editRole,payload)
    },
    //删除角色
    *delRole({ payload },{ call,put }){
      return yield call(api.delRole,payload)
    },
    *exportList({ payload }, { call, put}){
      yield call(api.exportFile, payload)
    }
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        dataList: payload
      };
    },
    saveInitData(state, { payload }) {
      return {
        ...state,
        activeList: payload.activeList,
        infoData: payload
      }
    },
    setQueryConfig(state, { payload }) {
      return {
        ...state,
        queryConfig: payload
      }
    },
    modifyMenuAuthorize(state, { payload }) {
      return {
        ...state,
        activeList: payload
      };
    }
  },
};
