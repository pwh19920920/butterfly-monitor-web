import { request } from 'umi';

/** 获取列表 GET /api/monitor/dashboard */
export async function monitorDashboardQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.MonitorDashboard[]>>('/api/monitor/dashboard', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取列表 GET /api/monitor/dashboard/all */
export async function monitorDashboardQueryAll() {
  return request<API.Resp<API.MonitorDashboard[]>>('/api/monitor/dashboard/all', {
    method: 'GET',
  });
}

/** 创建列表 POST /api/monitor/dashboard */
export async function monitorDashboardCreate(data: API.MonitorDashboard) {
  return request<API.Resp<string>>('/api/monitor/dashboard', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/monitor/dashboard */
export async function monitorDashboardUpdate(data: API.MonitorDashboard) {
  return request<API.Resp<string>>('/api/monitor/dashboard', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
