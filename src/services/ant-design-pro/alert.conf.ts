import { request } from 'umi';

/** 获取列表 GET /api/alert/conf */
export async function alertConfQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.AlertConf[]>>('/api/alert/conf', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建列表 POST /api/alert/conf */
export async function alertConfCreate(data: API.AlertConf) {
  return request<API.Resp<string>>('/api/alert/conf', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/alert/conf */
export async function alertConfUpdate(data: API.AlertConf) {
  return request<API.Resp<string>>('/api/alert/conf', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
