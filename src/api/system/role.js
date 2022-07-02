import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/role/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  });
};
export const grantTree = () => {
  return request({
    url: '/api/blade-system/menu/grant-tree',
    method: 'get',
  });
};

export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds) => {
  return request({
    url: '/api/blade-system/role/grant',
    method: 'post',
    data: {
      roleIds,
      menuIds,
      dataScopeIds,
      apiScopeIds
    }
  });
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/role/remove',
    method: 'post',
    params: {
      ids,
    }
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-system/role/submit',
    method: 'post',
    data: row
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-system/role/submit',
    method: 'post',
    data: row
  });
};


export const getRole = (roleIds) => {
  return request({
    url: '/api/blade-system/menu/role-tree-keys',
    method: 'get',
    params: {
      roleIds,
    }
  });
};

export const getRoleTree = (tenantId) => {
  return request({
    url: '/api/blade-system/role/tree',
    method: 'get',
    params: {
      tenantId,
    }
  });
};

// 获取角色下的用户
export const getMemberOwnedRole = params => {
  return request({
    url: '/api/blade-user/get_user',
    method: 'get',
    params,
  });
};

// 获取没有该角色的用户 
export const getMemberNotOwnedRole = params => {
  return request({
    url: '/api/blade-user/get_notrole',
    method: 'get',
    params,
  });
};

// 保存用户(修改用户)
export const modifyMemberOfRole = data => {
  return request({
    url: '/api/blade-user/add_role',
    method: 'post',
    data,
  });
};

export const getRoleTreeById = (roleId) => {
  return request({
    url: '/api/blade-system/role/tree-by-id',
    method: 'get',
    params: {
      roleId,
    }
  });
};
