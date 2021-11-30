import { request } from 'umi';

/** 获取列表 GET /api/alert/channel */
export async function alertChannelQuery(params: API.PageParams, options?: Record<string, any>) {
  return request<API.Resp<API.AlertChannel[]>>('/api/alert/channel', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取列表 GET /api/alert/channel/handlers */
export async function alertChannelHandlers() {
  return request<API.Resp<API.AlertChannelHandler[]>>('/api/alert/channel/handlers', {
    method: 'GET'
  });
}

/** 创建列表 POST /api/alert/channel */
export async function alertChannelCreate(data: API.AlertChannel) {
  return request<API.Resp<string>>('/api/alert/channel', {
    method: 'POST',
    data: { ...data } || {},
  });
}

/** 创建列表 PUT /api/alert/channel */
export async function alertChannelUpdate(data: API.AlertChannel) {
  return request<API.Resp<string>>('/api/alert/channel', {
    method: 'PUT',
    data: { ...data } || {},
  });
}
