// 机构岗位
import request from '@/router/axios';

// 岗位列表
export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-system/post/dept_post',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  });
};

// export const getPostList = (tenantId) => {
//   return request({
//     url: '/api/blade-system/post/select',
//     method: 'get',
//     params: {
//       tenantId
//     }
//   });
// };

export const getDetail = (id) => {
  return request({
    url: '/api/blade-system/post/detail',
    method: 'get',
    params: {
      id
    }
  });
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-system/post/remove',
    method: 'post',
    params: {
      ids,
    }
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-system/post/submit',
    method: 'post',
    data: row
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-system/post/submit',
    method: 'post',
    data: row
  });
};


// 新增的
// 当前机构的全部角色
export const getDeptRole = params => {
  return request({
    url: '/api/blade-system/role/dept_role',
    method: 'get',
    params,
  });
};

// 当前岗位拥有的角色
export const getDeptPostRole = params => {
  return request({
    url: '/api/blade-system/role/post_role',
    method: 'get',
    params,
  });
};

// 修改岗位的角色
export const modifyDeptPostRole = data => {
  return request({
    url: '/api/blade-system/blade-system/post/add_role',
    method: 'post',
    data,
  });
};

// 当前机构的全部店铺
export const getDeptStore = () => {
  return request({
    url: '/api/seeics-mws/store/dept_mws',
    method: 'get',
  });
};

// 当前岗位拥有权限的店铺
export const getDeptPostStore = params => {
  return request({
    url: '/api/seeics-mws/store/post_store',
    method: 'get',
    params,
  });
};

// 修改岗位的店铺
export const modifyDeptPostStore = data => {
  return request({
    url: '/api/blade-system/blade-system/post/add_store',
    method: 'post',
    data,
  });
};

// 获取岗位下的用户
export const getMemberOwnedPost = params => {
  return request({
    url: '/api/blade-user/post_user',
    method: 'get',
    params,
  });
};

// 获取没有该岗位的用户 
export const getMemberNotOwnedPost = params => {
  return request({
    url: '/api/blade-user/notpost_user',
    method: 'get',
    params,
  });
};

// 保存用户(修改用户)
export const modifyMemberOfPost = data => {
  return request({
    url: '/api/blade-user/add_post',
    method: 'post',
    data,
  });
};


