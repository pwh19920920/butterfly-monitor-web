import { request } from 'umi';

/** 获取列表 GET /api/monitor/task */
export async function monitorTaskQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.MonitorTask[]>>('/api/monitor/task', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建列表 POST /api/monitor/task */
export async function monitorTaskCreate(data: API.MonitorTask) {
  return request<API.Resp<string>>('/api/monitor/task', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/monitor/task */
export async function monitorTaskUpdate(data: API.MonitorTask) {
  return request<API.Resp<string>>('/api/monitor/task', {
    method: 'PUT',
    data: { ...data } || {},
  });
}

export async function monitorTaskModifyAlertStatus(id: string, status: number) {
  return request<API.Resp<string>>(`/api/monitor/task/alertStatus/${id}/${status}`, {
    method: 'PUT',
  });
}

export async function monitorTaskModifySampled(id: string, status: number) {
  return request<API.Resp<string>>(`/api/monitor/task/sampled/${id}/${status}`, {
    method: 'PUT',
  });
}

export async function monitorTaskModifyTaskStatus(id: string, status: number) {
  return request<API.Resp<string>>(`/api/monitor/task/taskStatus/${id}/${status}`, {
    method: 'PUT',
  });
}

export async function monitorTaskExecForTimeRange(id: string, data: any) {
  return request<API.Resp<string>>(`/api/monitor/task/execForTimeRange/${id}`, {
    method: 'POST',
    data: { ...data } || {},
  });
}
