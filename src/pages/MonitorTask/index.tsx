import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FormattedMessage} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import {ModalForm} from '@ant-design/pro-form';
import CreateOrUpdateForm from '@/pages/MonitorTask/components/UpdateForm';
import {MonitorTaskAlertStatusEnum, TaskTypeEnum} from '@/services/ant-design-pro/enum';
import {
  monitorTaskCreate,
  monitorTaskModifyAlertStatus,
  monitorTaskModifySampled,
  monitorTaskModifyTaskStatus,
  monitorTaskQuery,
  monitorTaskUpdate,
} from '@/services/ant-design-pro/monitor.task';
import moment from 'moment';

const handleCreate = async (fields: API.MonitorTask) => {
  const hide = message.loading('正在添加');
  try {
    await monitorTaskCreate({ ...fields });
    hide();
    message.success('保存任务成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存任务失败!');
    return false;
  }
};

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleUpdate = async (fields: API.MonitorTask) => {
  const hide = message.loading('正在添加');
  try {
    await monitorTaskUpdate({ ...fields });
    hide();
    message.success('更新任务成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新任务失败!');
    return false;
  }
};

const handleModifyAlertStatus = async (id: string, status: number) => {
  const hide = message.loading('正在修改');
  try {
    await monitorTaskModifyAlertStatus(id, status);
    hide();
    message.success('更新任务成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新任务失败!');
    return false;
  }
};

const handleModifyTaskStatus = async (id: string, status: number) => {
  const hide = message.loading('正在修改');
  try {
    await monitorTaskModifyTaskStatus(id, status);
    hide();
    message.success('更新任务成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新任务失败!');
    return false;
  }
};

const handleModifySampled = async (id: string, status: number) => {
  const hide = message.loading('正在修改');
  try {
    await monitorTaskModifySampled(id, status);
    hide();
    message.success('更新收集状态成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新收集状态失败!');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [modifyModalVisible, handleModifyModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MonitorTask>();

  const columns: ProColumns<API.MonitorTask>[] = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      ellipsis: true,
      width: 300,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '任务key',
      dataIndex: 'taskKey',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      valueEnum: TaskTypeEnum,
    },
    {
      title: '报警状态',
      dataIndex: ['taskAlert', 'alertStatus'],
      valueEnum: MonitorTaskAlertStatusEnum,
      hideInSearch: true,
    },
    {
      title: '上一次执行时间',
      dataIndex: 'preExecuteTime',
      hideInSearch: true,
    },
    {
      title: '错误原因',
      dataIndex: 'collectErrMsg',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 350,
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleModifyModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,

        <a
          key="alertStatus"
          onClick={async () => {
            const success = await handleModifyAlertStatus(
              record.id,
              record.alertStatus === 0 ? 1 : 0,
            );
            if (success && actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          {record.alertStatus === 0 ? '开启' : '关闭'}报警
        </a>,

        <a
          key="taskStatus"
          onClick={async () => {
            const success = await handleModifyTaskStatus(
              record.id,
              record.taskStatus === 0 ? 1 : 0,
            );
            if (success && actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          {record.taskStatus === 0 ? '开启' : '关闭'}任务
        </a>,

        <a
          key="sampled"
          onClick={async () => {
            const success = await handleModifySampled(record.id, record.sampled === 0 ? 1 : 0);
            if (success && actionRef.current) {
              actionRef.current.reload();
            }
          }}
        >
          {record.sampled === 0 ? '显示' : '隐藏'}样本
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MonitorTask, API.PageParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={monitorTaskQuery}
        scroll={{ x: 1300 }}
        columns={columns}
        rowSelection={
          {
            // onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
            // 批量选择
            // },
          }
        }
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.taskName && (
          <ProDescriptions<API.MonitorTask>
            column={2}
            title={currentRow?.taskName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.taskName,
            }}
            columns={columns as ProDescriptionsItemProps<API.MonitorTask>[]}
          />
        )}
      </Drawer>

      {createModalVisible && (
        <ModalForm
          title="创建任务"
          width="740px"
          visible={createModalVisible}
          onVisibleChange={handleModalVisible}
          onFinish={async (value: API.MonitorTask) => {
            if (!value.taskAlert.checkParams || value.taskAlert.checkParams.length == 0) {
              message.success('异常检测规则不能为空');
              return;
            }

            for (let i = 0; i < value.taskAlert.checkParams.length; i++) {
              const checkParam = value.taskAlert.checkParams[i];
              if (!checkParam.rules || checkParam.rules.length == 0) {
                message.success('异常检测规则不能为空');
                return;
              }
              value.taskAlert.checkParams[i].effectTimes[0] = moment(
                value.taskAlert.checkParams[i].effectTimes[0],
              ).format('HH:mm:ss');
              value.taskAlert.checkParams[i].effectTimes[1] = moment(
                value.taskAlert.checkParams[i].effectTimes[1],
              ).format('HH:mm:ss');
            }
            const success = await handleCreate({ ...value });
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <CreateOrUpdateForm taskType={-1} exeParams={JSON.parse('{}')} />
        </ModalForm>
      )}

      {modifyModalVisible && currentRow ? (
        <ModalForm
          title={'更新任务'}
          width="1100px"
          initialValues={{
            ...currentRow,
            taskAlert: {
              ...currentRow.taskAlert,
              checkParams: currentRow.taskAlert.checkParams
                ? currentRow.taskAlert.checkParams.map((item) => {
                    return {
                      ...item,
                      effectTimes: [
                        moment(item.effectTimes[0], 'HH:mm:ss'),
                        moment(item.effectTimes[1], 'HH:mm:ss'),
                      ],
                    };
                  })
                : [],
            },
          }}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          onFinish={async (value: API.MonitorTask) => {
            if (!value.taskAlert.checkParams || value.taskAlert.checkParams.length == 0) {
              message.success('异常检测规则不能为空');
              return;
            }

            for (let i = 0; i < value.taskAlert.checkParams.length; i++) {
              const checkParam = value.taskAlert.checkParams[i];
              if (!checkParam.rules || checkParam.rules.length == 0) {
                message.success('异常检测规则不能为空');
                return;
              }
              value.taskAlert.checkParams[i].effectTimes[0] = moment(
                value.taskAlert.checkParams[i].effectTimes[0],
              ).format('HH:mm:ss');
              value.taskAlert.checkParams[i].effectTimes[1] = moment(
                value.taskAlert.checkParams[i].effectTimes[1],
              ).format('HH:mm:ss');
            }

            const success = await handleUpdate({ ...currentRow, ...value });
            if (success) {
              handleModifyModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <CreateOrUpdateForm
            taskType={currentRow.taskType}
            exeParams={JSON.parse(currentRow.execParams)}
          />
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
