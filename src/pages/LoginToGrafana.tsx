import React, { useEffect } from 'react';
import { message, notification, Spin } from 'antd';
import { history } from '@@/core/history';
import { authority } from '@/services/ant-design-pro/login';

const handler = async (fields: any): Promise<API.Resp<API.SysLoginAuthorizeResponse>> => {
  const hide = message.loading('数据获取中...');
  try {
    const resp = await authority({ ...fields });
    hide();
    message.success('数据获取成功');
    return resp;
  } catch (error) {
    hide();
    message.error('数据获取失败, 联系管理员!');
    return Promise.reject();
  }
};

const LoginToGrafana: React.FC = () => {
  // 上后端获取转发地址:  http://grafana/callback?code=xxx, 然后跳转

  const { query } = history.location;
  const { state, client_id, redirect_uri } = query as { state: string; client_id: string, redirect_uri: string };
  if (!state || !client_id || !redirect_uri) {
    notification.error({
      description: '参数有误',
      message: '参数有误',
    });
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    handler({clientId: client_id})
      .then((resp) => {
        // location.href = `${resp.data.redirectUrl}?state=${state}&code=${resp.data.code}`;
        location.href = `${redirect_uri}?state=${state}&code=${resp.data.code}`;
      })
      .catch(() => {});
  }, []);

  return <Spin size="large" tip="Loading..." />;
};

export default LoginToGrafana;
