import { request } from 'umi';

/** 获取列表 GET /api/monitor/task/event */
export async function monitorTaskEventQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.MonitorTaskEvent[]>>('/api/monitor/task/event', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建列表 PUT /api/monitor/task/event/deal/:id */
export async function monitorTaskEventDeal(data: API.MonitorTaskEvent) {
  return request<API.Resp<string>>(`/api/monitor/task/event/deal/${data.id}`, {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/monitor/task/event/complete/:id */
export async function monitorTaskEventComplete(data: API.MonitorTaskEvent) {
  return request<API.Resp<string>>(`/api/monitor/task/event/complete/${data.id}`, {
    method: 'POST',
    data: { ...data } || {},
  });
}
