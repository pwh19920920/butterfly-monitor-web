export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/monitor',
    name: 'monitor',
    icon: 'smile',
    access: 'routeAccess',
    routes: [
      {
        name: 'monitorDatabase',
        access: 'routeAccess',
        path: '/monitor/database',
        component: './MonitorDatabase/index',
      },
    ],
  },
  {
    path: '/sys',
    name: 'sys',
    icon: 'crown',
    access: 'routeAccess',
    routes: [
      {
        name: 'sysMenu',
        path: '/sys/sysMenu',
        access: 'routeAccess',
        component: './SysMenu/index',
      },
      {
        name: 'sysRole',
        path: '/sys/sysRole',
        access: 'routeAccess',
        component: './SysRole/index',
      },
      {
        name: 'sysUser',
        path: '/sys/sysUser',
        access: 'routeAccess',
        component: './SysUser/index',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
