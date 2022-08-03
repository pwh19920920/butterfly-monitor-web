import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/login';
import {
  BookOutlined,
  CrownOutlined,
  LinkOutlined,
  SmileOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { notification } from 'antd';
import type { RequestInterceptor, RequestOptionsInit, ResponseError } from 'umi-request';
import React from 'react';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.SysUser;
  fetchUserInfo?: () => Promise<API.SysUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname.indexOf(loginPath) == -1 || localStorage.getItem('token')) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  const iconMap = new Map<string, React.ReactElement>();
  iconMap.set('smile', <SmileOutlined />);
  iconMap.set('crown', <CrownOutlined />);
  iconMap.set('table', <TableOutlined />);

  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && history.location.pathname.indexOf(loginPath) == -1) {
        history.push(`${loginPath}?redirect=${history.location.pathname}`);
        return;
      }

      // 如果已经登录
      if (initialState?.currentUser) {
        // 已登录就判断是否有redirect
        const { query } = history.location;
        const { redirect } = query as { redirect: string };

        if (redirect) {
          if (redirect.indexOf('://') != -1) {
            location.href = redirect;
            return;
          }

          history.push(redirect || '/');
          return;
        }

        // 没有redirect就该怎么样就怎么样
        history.push(history.location);
        return;
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    menuDataRender: (menuData: any[]) => {
      return menuData.map((item) => {
        if (typeof item.icon == 'string') {
          return {
            ...item,
            icon: iconMap.get(item.icon),
          };
        }
        return item;
      });
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: initialState,
      request: async (_: any, defaultMenuData: any) => {
        return initialState?.currentUser?.menus || defaultMenuData;
      },
    },
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const authHeaderInterceptor: RequestInterceptor = (url: string, options: RequestOptionsInit) => {
  const obj: any = options;
  if (localStorage.getItem('token')) {
    const token = localStorage.getItem('token');
    obj.headers = {
      ...obj.headers,
      Authorization: token || '',
      'Content-Type': 'application/json',
    };
  }
  return { url, obj };
};

/**
 * 异常处理
 */
const errorHandler = (error: ResponseError) => {
  const { response, data } = error;
  if (response && response.status) {
    if (history.location.pathname === loginPath) {
      throw error;
    }

    // 状态码非 2xx 的响应: 也就是业务处理异常
    let errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;

    // 赋予特殊值
    if (data && data.message) {
      errorText = data.message;
    }

    notification.error({
      message: `请求错误: ${status}`,
      description: errorText,
    });

    // 已经退出
    if (response.status === 401) {
      // 双层嵌套控制
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      if (redirect) {
        const search = history.location.search;
        location.href = `${loginPath}?redirect=${search.substring(10, search.length)}`;
        localStorage.clear();
        return;
      }

      // 非双层嵌套控制
      location.href = `${loginPath}?redirect=${history.location.pathname}${history.location.search}`;
      localStorage.clear();
    }
  } else if (data) {
    const errorText = data.message;
    notification.error({
      message: `请求错误`,
      description: errorText,
    });
  } else {
    // 请求发出前出错或没有响应
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  credentials: 'include',
  requestInterceptors: [authHeaderInterceptor],
};
