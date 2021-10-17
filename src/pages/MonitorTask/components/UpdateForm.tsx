import React, { useEffect, useState } from 'react';
import ProForm, {
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { TaskTypeEnum } from '@/services/ant-design-pro/enum';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { monitorDatabaseQueryAll } from '@/services/ant-design-pro/monitor.database';

const taskTypes = Object.keys(TaskTypeEnum).map((item) => {
  return {
    value: Number(item),
    label: TaskTypeEnum[item],
  };
});

type MonitorDatabaseItem = {
  label: string;
  value: string;
};

type CreateOrUpdateFormProps = {
  taskType: number;
};

const CreateOrUpdateForm: React.FC<CreateOrUpdateFormProps> = (props: CreateOrUpdateFormProps) => {
  const [selectTaskType, setSelectTaskType] = useState<number>(props.taskType);
  const [databases, setDatabases] = useState<MonitorDatabaseItem[]>([]);

  const reloadData = async () => {
    const resp: API.Resp<API.MonitorDatabase[]> = await monitorDatabaseQueryAll();
    if (resp.data) {
      setDatabases(
        resp.data.map((item: API.MonitorDatabase): MonitorDatabaseItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
  };

  useEffect(() => {
    reloadData().then(() => {});
  }, []);

  if (databases.length == 0) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  return (
    <>
      <ProForm.Group>
        <ProFormText
          label="任务名称"
          rules={[
            {
              required: true,
              message: '任务名称不能为空',
            },
          ]}
          width="md"
          placeholder="请输入任务名称"
          name="taskName"
        />

        <ProFormText
          label="任务key"
          rules={[
            {
              required: true,
              message: '任务key不能为空',
            },
          ]}
          width="md"
          placeholder="请输入任务key"
          name="taskKey"
        />

        <ProFormDigit
          label="任务执行周期"
          rules={[
            {
              required: true,
              message: '任务执行周期不能为空',
            },
            ({}) => ({
              validator(_, value) {
                if (value % 30 === 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('任务执行周期必须是30s的倍数'));
              },
            }),
          ]}
          min={30}
          width="md"
          fieldProps={{ step: 30 }}
          placeholder="请输入任务执行周期, 30s为周期"
          name="timeSpan"
        />

        <ProFormSelect
          options={taskTypes}
          rules={[
            {
              required: true,
              message: '任务类型不能为空',
            },
          ]}
          width="md"
          fieldProps={{
            onChange: (value: number) => {
              setSelectTaskType(value);
            },
          }}
          name="taskType"
          label="任务类型"
        />
      </ProForm.Group>

      {selectTaskType == 0 && (
        <ProFormSelect
          options={databases}
          rules={[
            {
              required: true,
              message: '数据库不能为空',
            },
          ]}
          width="md"
          fieldProps={{
            showSearch: true,
          }}
          name={['taskExecParams', 'databaseId']}
          placeholder="请选择数据库"
          label="数据库"
        />
      )}

      <ProFormTextArea
        label="执行指令"
        rules={[
          {
            required: true,
            message: '执行指令不能为空',
          },
        ]}
        name="command"
      />
    </>
  );
};

export default CreateOrUpdateForm;
