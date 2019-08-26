import request from '@/utils/request';
//const _baseApi = '/engine'
const _baseApi = '/merchant-admin'
const _api='/engine'
//查询变量分类列表信息
export async function queryClassList(params) {
  return request(`${_baseApi}/variable/type/firstVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
export async function getSelectLevel1(params) {
  return request(`${_baseApi}/variable/type/firstVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function getSelectLevel2(params) {
  return request(`${_baseApi}/variable/type/secondVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//添加变量（一级/二级）
export async function addVarClass(params) {
  return request(`${_baseApi}/variable/type/insertVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}

//修改变量（一级/二级）
export async function editVarClass(params) {
  return request(`${_baseApi}/variable/type/updateVariableType`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}
//删除变量（一级/二级）
export async function delVarClass(params){
  return request(`${_api}/varClass/deleteClass`, {
    method: 'POST',
    body: {
      ...params
    },
  });
}