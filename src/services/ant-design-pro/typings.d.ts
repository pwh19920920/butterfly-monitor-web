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
    taskExecParams: {
      databaseId: string;
    };
  };
}
