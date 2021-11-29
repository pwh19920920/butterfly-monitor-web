import { request } from 'umi';

/** 获取列表 GET /api/alert/group */
export async function alertGroupQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.AlertGroup[]>>('/api/alert/group', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取列表 GET /api/alert/group/all, 下拉用的 */
export async function alertGroupQueryAll() {
  return request<API.Resp<API.AlertGroup[]>>('/api/alert/group/all', {
    method: 'GET',
  });
}

/** 获取组下面得所有用户 GET /api/alert/group/groupUser/:id  */
export async function alertGroupUserQueryByGroupId(groupId: string) {
  return request<API.Resp<string[]>>(`/api/alert/group/groupUser/${groupId}`, {
    method: 'GET',
  });
}

/** 创建分组 POST /api/alert/group */
export async function alertGroupCreate(data: API.AlertGroup) {
  return request<API.Resp<string>>('/api/alert/group', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 更新分组 PUT /api/alert/group */
export async function alertGroupUpdate(data: API.AlertGroup) {
  return request<API.Resp<string>>('/api/alert/group', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
