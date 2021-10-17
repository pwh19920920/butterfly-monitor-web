/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.SysUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAccess: (permission: string) => currentUser && currentUser.permissions?.includes(permission),
    routeAccess: (route: { name: any }) => currentUser && currentUser.codes?.includes(route.name),
  };
}
