import React, {useState} from 'react';
import {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import {AlertConfTypeEnum} from "@/services/ant-design-pro/enum";

const alertConfType = Object.keys(AlertConfTypeEnum).map((item) => {
  return {
    value: Number(item),
    label: AlertConfTypeEnum[item],
  };
});

type CreateOrUpdateFormProps = {
  confType: number;
};

const CreateOrUpdateForm: React.FC<CreateOrUpdateFormProps> = (props: CreateOrUpdateFormProps) => {
  const [selectConfType, SetSelectConfType] = useState<number>(props.confType);

  return (
    <>
      <ProFormText
        label="配置key"
        rules={[
          {
            required: true,
            message: '配置key不能为空',
          },
        ]}
        width="md"
        placeholder="请输入配置key"
        name="confKey"
      />

      <ProFormSelect
        options={alertConfType}
        rules={[
          {
            required: true,
            message: '配置类型不能为空',
          },
        ]}
        width="md"
        fieldProps={{
          onChange: (value: number) => {
            SetSelectConfType(value);
          },
        }}
        name="confType"
        label="配置类型"
      />

      <ProFormText
        label="配置描述"
        rules={[
          {
            required: true,
            message: '配置描述不能为空',
          },
        ]}
        width="md"
        placeholder="请输入配置描述"
        name="confDesc"
      />

      {selectConfType === 1 && <>
        <ProFormDigit
          label="配置值"
          rules={[
            {
              required: true,
              message: '配置值不能为空',
            },
          ]}
          min={30}
          width="md"
          placeholder="请输入请输入配置值"
          name="confVal"
        />
      </>}

      {selectConfType === 2 && <>
        <ProFormTextArea
          label="配置值"
          rules={[
            {
              required: true,
              message: '配置值不能为空',
            },
          ]}
          width="md"
          placeholder="请输入配置值"
          name="confVal"
        />
      </>}
    </>
  );
};

export default CreateOrUpdateForm;
