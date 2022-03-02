import React, {useEffect, useState} from 'react';
import ProForm, {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea,} from '@ant-design/pro-form';
import {AlertChannelFailRouteEnum, AlertChannelSSlEnum, AlertChannelTypeEnum} from "@/services/ant-design-pro/enum";
import {ProFormInstance} from "@ant-design/pro-form/lib/BaseForm";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

type SelectItem = {
  label: string;
  value: number;
};

type HandlerSelectItem = {
  label: string;
  value: string;
};

type CreateOrUpdateFormProps = {
  channelHandlers: API.AlertChannelHandler[];
  channelType: number;
  formRef: React.MutableRefObject<ProFormInstance<API.AlertChannel> | undefined>;
};

const failRoutes = Object.keys(AlertChannelFailRouteEnum).map((item) => {
  return {
    value: Number(item),
    label: AlertChannelFailRouteEnum[item],
  };
});

const sslSelects = Object.keys(AlertChannelSSlEnum).map((item) => {
  return {
    value: Number(item),
    label: AlertChannelSSlEnum[item],
  };
});

const CreateOrUpdateForm: React.FC<CreateOrUpdateFormProps> = (prop) => {
  const [selectChannelType, setSelectChannelType] = useState<number>(prop.channelType);
  const [selectChannelHandlers, setSelectChannelHandlers] = useState<HandlerSelectItem[]>();
  const [channelHandlerMaps, setChannelHandlerMaps] = useState<Map<number, HandlerSelectItem[]>>(new Map());
  const channelTypes: SelectItem[] = prop.channelHandlers.map((item): SelectItem => {
    return {
      value: Number(item.channelType),
      label: AlertChannelTypeEnum[item.channelType],
    };
  });


  useEffect(() => {
    const handlersMap = new Map();
    prop.channelHandlers.forEach((item) => {
      handlersMap.set(item.channelType, item.handlers.map((handle): HandlerSelectItem => {
        return {
          value: handle,
          label: handle,
        };
      }));
    });

    // 设置选择器
    setChannelHandlerMaps(handlersMap);

    //  设置默认
    const handlers = handlersMap.get(prop.channelType)
    setSelectChannelHandlers(handlers);
  }, []);

  if (channelHandlerMaps.size == 0) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  return (
    <>
      <ProForm.Group title="通道基础信息">
        <ProFormText
          label="通道名称"
          rules={[
            {
              required: true,
              message: '通道名称不能为空',
            },
          ]}
          width="md"
          placeholder="请输入通道名称"
          name="name"
        />

        <ProFormSelect
          showSearch
          options={failRoutes}
          rules={[
            {
              required: true,
              message: '失败路由不能为空',
            },
          ]}
          width="md"
          name="failRoute"
          label="失败路由"
        />

        <ProFormSelect
          showSearch
          options={channelTypes}
          rules={[
            {
              required: true,
              message: '通道类型不能为空',
            }
          ]}
          fieldProps={{
            onChange: (value: number) => {
              setSelectChannelType(value);

              const current = channelHandlerMaps.get(value);
              setSelectChannelHandlers(current);
              prop.formRef.current?.setFieldsValue({handler: current && current.length > 0 ? current[0].value : ""});
            },
          }}
          width="md"
          name="type"
          label="通道类型"
        />

        {selectChannelType != -1 && (
          <ProFormSelect
            showSearch
            options={selectChannelHandlers}
            rules={[
              {
                required: true,
                message: '通道处理器不能为空',
              },
            ]}
            width="md"
            name="handler"
            label="通道处理器"
          />
        )}
      </ProForm.Group>

      {selectChannelType == 1 && (
        <ProForm.Group title="报警通道参数">
          <ProFormText
            label="smtp地址"
            rules={[
              {
                required: true,
                message: 'smtp地址不能为空',
              },
            ]}
            width="md"
            placeholder="smtp地址，例如smtp.exmail.qq.com"
            name={['paramsObj', "host"]}
          />

          <ProFormDigit
            label="smtp端口"
            rules={[
              {
                required: true,
                message: 'smtp端口不能为空',
              },
            ]}
            width="md"
            placeholder="smtp端口"
            name={['paramsObj', "port"]}
          />

          <ProFormText
            label="smtp用户名"
            rules={[
              {
                required: true,
                message: 'smtp用户名不能为空',
              },
            ]}
            width="md"
            placeholder="smtp用户名"
            name={['paramsObj', "username"]}
          />

          <ProFormText
            label="smtp密码"
            rules={[
              {
                required: true,
                message: 'smtp密码不能为空',
              },
            ]}
            width="md"
            placeholder="smtp密码"
            name={['paramsObj', "password"]}
          />

          <ProFormSelect
            options={sslSelects}
            rules={[
              {
                required: true,
                message: '是否ssl不能为空',
              },
            ]}
            width="md"
            name={['paramsObj', "ssl"]}
            label="是否是SSL"
          />
        </ProForm.Group>
      )}

      {selectChannelType == 2 && (
        <ProFormTextArea
          label="webhook地址"
          rules={[
            {
              required: true,
              message: 'webhook地址不能为空',
            },
          ]}
          placeholder="webhook地址"
          name={['paramsObj', "addr"]}
        />
      )}

      <ProForm.Group title="通道测试参数"/>
      <ProFormTextArea
        label="测试模板内容"
        rules={[
          {
            required: true,
            message: '测试模板内容不能为空',
          },
        ]}
        placeholder="请输入测试模板内容"
        name={['testParams', "template"]}
      />

      {selectChannelType == 1 && (
        <ProFormText
          label="测试接收人邮箱"
          rules={[
            {
              required: true,
              message: '请输入测试接收人邮箱不能为空',
            },
          ]}
          placeholder="请输入测试接收人邮箱"
          name={['testParams', "email"]}
        />
      )}
    </>
  );
};

export default CreateOrUpdateForm;
