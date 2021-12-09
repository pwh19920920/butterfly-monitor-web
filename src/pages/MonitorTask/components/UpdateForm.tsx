import React, { useEffect, useState } from 'react';
import ProForm, {
  ProFormDigit,
  ProFormList,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTimePicker,
} from '@ant-design/pro-form';
import {
  CheckParamCompareTypeEnum,
  CheckParamRelationEnum,
  CheckParamValueTypeEnum,
  TaskRecallStatusEnum,
  TaskTypeEnum,
} from '@/services/ant-design-pro/enum';
import { Col, Divider, Modal, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { monitorDatabaseQueryAll } from '@/services/ant-design-pro/monitor.database';
import { monitorDashboardQueryAll } from '@/services/ant-design-pro/monitor.dashboard';
import { alertChannelQueryAll } from '@/services/ant-design-pro/alert.channel';
import { alertGroupQueryAll } from '@/services/ant-design-pro/alert.group';
import moment from 'moment';
import ProCard from '@ant-design/pro-card';

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

const relations = Object.keys(CheckParamRelationEnum).map((item) => {
  return {
    value: Number(item),
    label: CheckParamRelationEnum[item],
  };
});

const compareTypes = Object.keys(CheckParamCompareTypeEnum).map((item) => {
  return {
    value: Number(item),
    label: CheckParamCompareTypeEnum[item],
  };
});

const valueTypes = Object.keys(CheckParamValueTypeEnum).map((item) => {
  return {
    value: Number(item),
    label: CheckParamValueTypeEnum[item],
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
  const [alertChannels, setAlertChannels] = useState<MonitorDatabaseItem[]>([]);
  const [alertGroups, setAlertGroups] = useState<MonitorDatabaseItem[]>([]);

  const reloadData = async () => {
    const resp: API.Resp<API.MonitorDatabase[]> = await monitorDatabaseQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(
        resp.data.map((item: API.MonitorDatabase): MonitorDatabaseItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
    return Promise.reject();
  };

  const loadDashboard = async () => {
    const resp = await monitorDashboardQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(
        resp.data.map((item: API.MonitorDashboard): MonitorDatabaseItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
    return Promise.reject();
  };

  const loadAlertChannel = async () => {
    const resp = await alertChannelQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(
        resp.data.map((item: API.AlertChannel): MonitorDatabaseItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
    return Promise.reject();
  };

  const loadGroup = async () => {
    const resp = await alertGroupQueryAll();
    if (resp.data && resp.data.length > 0) {
      return Promise.resolve(
        resp.data.map((item: API.AlertGroup): MonitorDatabaseItem => {
          return { label: item.name, value: `${item.id}` };
        }),
      );
    }
    return Promise.reject();
  };

  useEffect(() => {
    // 数据源
    reloadData()
      .then((resp) => {
        setDatabases(resp);
      })
      .catch(() => {});

    // grafana面板
    loadDashboard()
      .then((resp) => {
        setDashboards(resp);
      })
      .catch(() => {
        Modal.info({
          title: '操作提示',
          content: (
            <div>
              <p>当前还没有添加任何面板, 请先添加面板再进行添加任务</p>
            </div>
          ),
          onOk() {
            location.href = '/monitor/dashboard';
          },
        });
      });

    // 报警通道
    loadAlertChannel()
      .then((resp) => {
        setAlertChannels(resp);
      })
      .catch(() => {
        Modal.info({
          title: '操作提示',
          content: (
            <div>
              <p>当前还没有添加任何报警通道, 请先添加报警通道再进行添加任务</p>
            </div>
          ),
          onOk() {
            location.href = '/monitor/dashboard';
          },
        });
      });

    // 报警组
    loadGroup()
      .then((resp) => {
        setAlertGroups(resp);
      })
      .catch(() => {
        Modal.info({
          title: '操作提示',
          content: (
            <div>
              <p>当前还没有添加任何报警组, 请先添加报警组再进行添加任务</p>
            </div>
          ),
          onOk() {
            location.href = '/monitor/dashboard';
          },
        });
      });
  }, []);

  if (dashboards.length == 0) {
    return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />;
  }

  return (
    <>
      <ProForm.Group title="任务基础信息">
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
          fieldProps={{ step: 30 }}
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
                    location.href = '/monitor/database';
                  },
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
            name={['taskExecParams', 'resultFieldPath']}
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

      <ProForm.Group title="报警检查配置">
        <ProFormSelect
          showSearch
          options={alertChannels}
          rules={[
            {
              required: true,
              message: '报警通道不能为空',
            },
          ]}
          fieldProps={{
            mode: 'multiple',
          }}
          width="md"
          name={['taskAlert', 'alertChannels']}
          label="报警通道"
        />

        <ProFormSelect
          showSearch
          options={alertGroups}
          rules={[
            {
              required: true,
              message: '报警分组不能为空',
            },
          ]}
          fieldProps={{
            mode: 'multiple',
          }}
          width="md"
          name={['taskAlert', 'alertGroups']}
          label="报警分组"
        />

        <ProFormDigit
          label="检查间隔"
          rules={[
            {
              required: true,
              message: '间隔间隔不能为空',
            },
          ]}
          width="md"
          placeholder="请输入检查间隔, s为单位"
          name={['taskAlert', 'timeSpan']}
        />

        <ProFormDigit
          label="持续时间"
          rules={[
            {
              required: true,
              message: '持续时间不能为空',
            },
          ]}
          width="md"
          placeholder="请输入持续时间, s为单位"
          name={['taskAlert', 'duration']}
        />
      </ProForm.Group>

      <Divider>异常检测规则</Divider>
      <ProFormList
        name={['taskAlert', 'checkParams']}
        itemRender={({ listDom, action }) => {
          return (
            <ProCard
              bordered
              extra={action}
              title={'规则条件组'}
              style={{
                marginBottom: 8,
              }}
            >
              {listDom}
            </ProCard>
          );
        }}
      >
        <Row gutter={24}>
          <Col span={12}>
            <ProFormSelect
              showSearch
              options={relations}
              rules={[
                {
                  required: true,
                  message: '条件关系不能为空',
                },
              ]}
              width="md"
              name={'relation'}
              label="条件关系"
            />
          </Col>
          <Col span={12}>
            <ProFormTimePicker.RangePicker
              name="effectTimes"
              rules={[
                {
                  required: true,
                  message: '生效时间不能为空',
                },
              ]}
              fieldProps={{
                showTime: true,
                format: 'HH:mm:ss',
                defaultValue: moment().startOf('day'),
              }}
              dataFormat="HH:mm:ss"
              label="生效时间"
              width="md"
            />
          </Col>
        </Row>
        <ProFormList
          name="rules"
          copyIconProps={false}
          deleteIconProps={{
            tooltipText: '不需要这行了',
          }}
        >
          <Row gutter={23}>
            <Col span={8}>
              <ProFormSelect
                showSearch
                options={compareTypes}
                rules={[
                  {
                    required: true,
                    message: '比较类型不能为空',
                  },
                ]}
                width="md"
                name={['compareType']}
                label="比较类型"
              />
            </Col>
            <Col span={8}>
              <ProFormDigit
                label="比较值"
                rules={[
                  {
                    required: true,
                    message: '比较值不能为空',
                  },
                ]}
                width="md"
                placeholder="请输入比较值"
                name={['value']}
              />
            </Col>
            <Col span={8}>
              <ProFormSelect
                showSearch
                options={valueTypes}
                rules={[
                  {
                    required: true,
                    message: '值类型不能为空',
                  },
                ]}
                width="md"
                name={['valueType']}
                label="值类型"
              />
            </Col>
          </Row>
        </ProFormList>
      </ProFormList>
    </>
  );
};

export default CreateOrUpdateForm;
