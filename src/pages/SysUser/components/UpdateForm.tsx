import React, { useEffect, useState } from 'react';
import { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { sysRoleQueryAll } from '@/services/ant-design-pro/sys.role';

type SysRoleItem = {
  label: string;
  value: string;
};
const CreateOrUpdateForm: React.FC = () => {
  const [roleData, setRoleData] = useState<SysRoleItem[]>([]);

  const reloadRoleData = async () => {
    const resp: API.Resp<API.SysRole[]> = await sysRoleQueryAll();
    if (resp.data) {
      setRoleData(
        resp.data.map((item: API.SysRole): SysRoleItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
  };

  useEffect(() => {
    reloadRoleData().then(() => {});
  }, []);

  if (roleData.length == 0) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  return (
    <>
      <ProFormText
        label="名称"
        rules={[
          {
            required: true,
            message: '名称不能为空',
          },
        ]}
        width="md"
        placeholder="请输入名称"
        name="name"
      />

      <ProFormText
        label="用户名"
        width="md"
        rules={[
          {
            required: true,
            message: '名称不能为空',
          },
        ]}
        placeholder="请输入用户名"
        name="username"
      />

      <ProFormText
        label="密码"
        width="md"
        placeholder="新增时必须输入, 修改过程中不修改无需输入"
        name="password"
      />

      <ProFormSelect
        name="roleList"
        label="角色"
        mode="multiple"
        options={roleData}
        placeholder="请选择用户角色"
        rules={[{ required: true, message: '请选择用户角色!' }]}
      />
    </>
  );
};

export default CreateOrUpdateForm;
