import { request } from 'umi';

/** 获取列表 GET /api/job/database */
export async function jobDatabaseQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.JobDatabase[]>>('/api/job/database', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建列表 POST /api/job/database */
export async function jobDatabaseCreate(data: API.JobDatabase) {
  return request<API.Resp<string>>('/api/job/database', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/job/database */
export async function jobDatabaseUpdate(data: API.JobDatabase) {
  return request<API.Resp<string>>('/api/job/database', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
