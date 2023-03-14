import { request } from 'umi';

/** 获取列表 GET /api/monitor/homeCount */
export async function monitorHomeCountQuery() {
  return request<API.Resp<API.MonitorTaskHomeCountResponse>>('/api/monitor/homeCount', {
    method: 'GET',
  });
}
