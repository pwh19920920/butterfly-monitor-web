import React, {useEffect, useState} from 'react';
import ProForm, {ProFormSelect, ProFormText,} from '@ant-design/pro-form';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {sysUserQueryAll} from "@/services/ant-design-pro/sys.user";

type SelectItem = {
  label: string;
  value: string;
};

type CreateOrUpdateFormProps = {
};

const CreateOrUpdateForm: React.FC<CreateOrUpdateFormProps> = () => {
  const [users, setUsers] = useState<SelectItem[]>([]);

  const reloadSysUserData = async () => {
    const resp: API.Resp<API.SysUser[]> = await sysUserQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(resp.data.map((item: API.SysUser): SelectItem => {
        return {label: `${item.name}-${item.username}`, value: `${item.id}`};
      }));
    }
    return Promise.reject();
  };

  useEffect(() => {
    // 数据源
    reloadSysUserData().then((resp) => {
      setUsers(resp);
    }).catch(() => {});
  }, []);

  if (users.length == 0) {
    return <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>;
  }

  return (
    <>
      <ProForm.Group>
        <ProFormText
          label="分组名称"
          rules={[
            {
              required: true,
              message: '分组名称不能为空',
            },
          ]}
          width="md"
          placeholder="请输入分组名称"
          name="name"
        />

        <ProFormSelect
          showSearch
          options={users}
          rules={[
            {
              required: true,
              message: '分组用户不能为空',
            },
          ]}
          fieldProps={{
            mode: 'multiple',
          }}
          width="md"
          name="groupUsers"
          label="分组用户"
        />
      </ProForm.Group>
    </>
  );
};

export default CreateOrUpdateForm;
