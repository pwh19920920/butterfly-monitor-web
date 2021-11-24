import React, {useEffect, useState} from 'react';
import ProForm, {ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea,} from '@ant-design/pro-form';
import {TaskRecallStatusEnum, TaskTypeEnum} from '@/services/ant-design-pro/enum';
import {Modal, Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {monitorDatabaseQueryAll} from '@/services/ant-design-pro/monitor.database';
import {monitorDashboardQueryAll} from "@/services/ant-design-pro/monitor.dashboard";

const taskTypes = Object.keys(TaskTypeEnum).map((item) => {
  return {
    value: Number(item),
    label: TaskTypeEnum[item],
  };
});

const recallStatus = Object.keys(TaskRecallStatusEnum).map((item) => {
  return {
    value: Number(item),
    label: TaskRecallStatusEnum[item],
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
  const isCreateView = props.taskType === -1;
  const [selectTaskType, setSelectTaskType] = useState<number>(props.taskType);
  const [databases, setDatabases] = useState<MonitorDatabaseItem[]>([]);
  const [dashboards, setDashboards] = useState<MonitorDatabaseItem[]>([]);

  const reloadData = async () => {
    const resp: API.Resp<API.MonitorDatabase[]> = await monitorDatabaseQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(resp.data.map((item: API.MonitorDatabase): MonitorDatabaseItem => {
        return {label: item.name, value: `${item.id}`};
      }));
    }
    return Promise.reject();
  };

  const loadDashboard = async () => {
    const resp = await monitorDashboardQueryAll()
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(resp.data.map((item: API.MonitorDashboard): MonitorDatabaseItem => {
        return {label: item.name, value: `${item.id}`};
      }));
    }
    return Promise.reject();
  }

  useEffect(() => {
    // 数据源
    reloadData().then((resp) => {
      setDatabases(resp);
    }).catch(() => {

    });

    // grafana面板
    loadDashboard().then((resp) => {
      setDashboards(resp);
    }).catch(() => {
      Modal.info({
        title: '操作提示',
        content: (
          <div>
            <p>当前还没有添加任何面板, 请先添加面板再进行添加任务</p>
          </div>
        ),
        onOk() {
          location.href = "/monitor/dashboard"
        },
      });
    });
  }, []);

  if (dashboards.length == 0) {
    return <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>;
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
          disabled={!isCreateView}
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
          fieldProps={{step: 30}}
          placeholder="请输入任务执行周期, 30s为周期"
          name="timeSpan"
        />

        <ProFormSelect
          options={recallStatus}
          rules={[
            {
              required: true,
              message: '回朔支持不能为空',
            },
          ]}
          width="md"
          name="recallStatus"
          label="是否支持回朔"
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
              // 选择数据库需要判断一下有没有数据源头
              if (value == 0 && databases.length == 0) {
                Modal.info({
                  title: '操作提示',
                  content: (
                    <div>
                      <p>当前还没有添加任何数据源, 请先添加数据源再进行添加任务</p>
                    </div>
                  ),
                  onOk() {
                    location.href = "/monitor/database"
                  }
                });
              }

              setSelectTaskType(value);
            },
          }}
          name="taskType"
          label="任务类型"
        />

        <ProFormSelect
          options={dashboards}
          rules={[
            {
              required: true,
              message: '归属面板不能为空',
            },
          ]}
          mode="multiple"
          width="md"
          name="dashboards"
          label="归属面板"
        />

        {selectTaskType == 1 && (
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

        {selectTaskType == 2 && (
          <ProFormText
            label="提取字段"
            rules={[
              {
                required: true,
                message: '提取字段不能为空',
              },
            ]}
            width="md"
            placeholder="结果字段, 支持复杂参数, 对象.属性"
            name={['taskExecParams', "resultFieldPath"]}
          />
        )}
      </ProForm.Group>

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
