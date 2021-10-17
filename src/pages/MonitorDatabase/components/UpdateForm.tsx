import React from 'react';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { DatabaseTypeEnum } from '@/services/ant-design-pro/enum';

const CreateOrUpdateForm: React.FC = () => {
  const types = Object.keys(DatabaseTypeEnum).map((item) => {
    return {
      value: Number(item),
      label: DatabaseTypeEnum[item],
    };
  });
  return (
    <>
      <ProForm.Group>
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

        <ProFormSelect
          options={types}
          rules={[
            {
              required: true,
              message: '数据库类型不能为空',
            },
          ]}
          width="md"
          name="type"
          label="数据库类型"
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText
          label="数据库地址"
          rules={[
            {
              required: true,
              message: '数据库地址不能为空',
            },
          ]}
          width="md"
          placeholder="请输入数据库地址"
          name="url"
        />

        <ProFormText label="数据库名称" width="md" placeholder="请输入数据库名称" name="database" />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormText
          label="数据库用户名"
          width="md"
          placeholder="请输入数据库用户名"
          name="username"
        />

        <ProFormText label="数据库密码" width="md" placeholder="请输入数据库密码" name="password" />
      </ProForm.Group>
    </>
  );
};

export default CreateOrUpdateForm;
