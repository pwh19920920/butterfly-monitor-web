// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Resp<T> = {
    status: number;
    data: T;
    message: string;

    pageSize?: number;
    current?: number;
    total?: number;
  };

  type SysUser = {
    id: string | number;
    name?: string;
    avatar?: string;
    username?: string;
    mobile?: string;
    email?: string;
    roles?: string;
    roleList: string[];
    menus?: SysMenu[];
    codes?: string[];
    permissions?: string[];
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type LoginParams = {
    username?: string;
    password?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type SysMenuOption = {
    id: number;
    name: string;
    value: string;
    method: string;
    path: string;
  };

  type SysMenu = {
    id: number;
    code: string;
    name: string;
    path: string;
    icon?: string;
    component?: string;
    sort?: number;
    options: SysMenuOption[];
    parent?: number;
    children?: SysMenu[];
    routes: SysMenu[];
  };

  type SysRole = {
    id: number | string;
    name: string;
    permissions: SysPermission[];
  };

  interface SysPermission {
    roleId?: string | number;
    menuId: string | number;
    option: string;
    independent: boolean;
    half: boolean;
    root: boolean;
  }

  interface SysRolePermission extends SysPermission {
    options: string[];
  }

  type MonitorDatabase = {
    id?: number;
    database?: string;
    name: string;
    username?: string;
    password?: string;
    url: string;
    type: number;
  };

  type MonitorTask = {
    id: string;
    preExecuteTime?: string;
    taskKey: string;
    taskName: string;
    timeSpace: number;
    command: string;
    taskType: number;
    execParams: string;
    taskStatus?: number;
    alertStatus?: number;
    recallStatus?: number;
    dashboards: string[];
    sampled: number;
    collectErrMsg?: string;
    sampleErrMsg?: string;
    taskExecParams: {
      databaseId: string;
    };
    taskAlert: TaskAlert;
  };

  type MonitorDashboard = {
    id: string;
    name: string;
    slug?: string;
    url?: string;
    uid?: string;
  };

  type MonitorDashboardTask = {
    id: string;
    dashboardId: string;
    taskId: string;
    taskName: string;
    taskKey: string;
    sort: number;
  };

  type AlertConf = {
    id: string;
    confKey: string;
    confVal: string;
    confDesc: string;
    confType: number;
  };

  type AlertGroup = {
    id: string;
    name: string;
    groupUsers: string[];
  };

  type AlertChannel = {
    id: string;
    name: string;
    type: number;
    params: string;
    paramsObj: any;
    handler: string;
    failRoute: number;
  };

  type AlertChannelHandler = {
    channelType: number;
    handlers: string[];
  };

  type TaskAlert = {
    alertChannels: string[];
    alertGroups: string[];
    effectTimes: string[];
    effectTime: string;
    timeSpan: number;
    duration: number;
    checkParams: TaskAlertParams[];
  };

  type TaskAlertParams = {
    relation: number;
    effectTimes: string[];
    rules: TaskAlertRule[];
  };

  type TaskAlertRule = {
    valueType: number;
    value: number;
    compareType: number;
  };

  type MonitorTaskEvent = {
    id: string;
    alertId: string;
    taskId: string;
    taskName: string;
    alertMsg: string; // 报警信息
    dealTime: string; // 处理时间
    completeTime: string; // 完成时间
    content: string; // 过程描述
    dealStatus: number; // 处理状态
    dealUser: string; // 处理人ID
    dealUserName: string; // 处理人, 只显示名字, 此值只做展示用
    preAlertTime: string; // 前一次报警时间
    nextAlertTime: string; // 下一次报警时间
  };

  type SysLoginAuthorizeResponse = {
    code: string;
    redirectUrl: string;
  };

  type MonitorTaskHomeCountResponse = {
    taskCount: number;
    eventCount: number;
    dashboardCount: number;
    databaseCount: number;
  }
}
