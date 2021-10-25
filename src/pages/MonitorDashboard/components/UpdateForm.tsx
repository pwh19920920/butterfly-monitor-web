import React from 'react';
import {ProFormText} from '@ant-design/pro-form';

const CreateOrUpdateForm: React.FC = () => {
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

    </>
  );
};

export default CreateOrUpdateForm;
