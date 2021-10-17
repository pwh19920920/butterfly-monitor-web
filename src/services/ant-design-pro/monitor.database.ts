import { request } from 'umi';

/** 获取列表 GET /api/monitor/database */
export async function monitorDatabaseQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.MonitorDatabase[]>>('/api/monitor/database', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建列表 POST /api/monitor/database */
export async function monitorDatabaseCreate(data: API.MonitorDatabase) {
  return request<API.Resp<string>>('/api/monitor/database', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/monitor/database */
export async function monitorDatabaseUpdate(data: API.MonitorDatabase) {
  return request<API.Resp<string>>('/api/monitor/database', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
