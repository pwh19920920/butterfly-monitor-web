import { Drawer, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import {
  monitorTaskEventComplete,
  monitorTaskEventDeal,
  monitorTaskEventQuery,
} from '@/services/ant-design-pro/monitor.task.event';
import { MonitorTaskEventDealStatus } from '@/services/ant-design-pro/enum';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';

const handleEventDeal = async (event: API.MonitorTaskEvent) => {
  const hide = message.loading('正在认领');
  try {
    await monitorTaskEventDeal(event);
    hide();
    message.success('认领成功');
    return true;
  } catch (error) {
    hide();
    message.error('认领失败!');
    return false;
  }
};

const handleEventComplete = async (event: API.MonitorTaskEvent) => {
  const hide = message.loading('正在更新');
  try {
    await monitorTaskEventComplete(event);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败!');
    return false;
  }
};

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [completeModalVisible, handleCompleteModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MonitorTaskEvent>();

  const columns: ProColumns<API.MonitorTaskEvent>[] = [
    {
      title: '任务编号',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      hideInSearch: true,
      ellipsis: true,
      width: 200,
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
      title: '异常信息',
      dataIndex: 'alertMsg',
      hideInSearch: true,
      ellipsis: true,
      width: 350,
    },
    {
      title: '处理内容',
      dataIndex: 'content',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '处理状态',
      dataIndex: 'dealStatus',
      valueEnum: MonitorTaskEventDealStatus,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAts',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '认领时间',
      dataIndex: 'dealTime',
      hideInSearch: true,
    },
    {
      title: '认领人',
      dataIndex: 'dealUserName',
      hideInSearch: true,
    },
    {
      title: '发生时间',
      dataIndex: 'createdAt',
      hideInSearch: true,
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      hideInSearch: true,
    },
    {
      title: '下一次报警时间',
      dataIndex: 'nextAlertTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => [
        record.dealStatus == 1 && (
          <a
            key="deal"
            onClick={() => {
              Modal.confirm({
                title: '异常事件认领提醒',
                icon: <ExclamationCircleOutlined />,
                content: `确认是否认领"${record.taskName}"异常事件?`,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  const resp = await handleEventDeal(record);
                  if (resp && actionRef.current) {
                    actionRef.current.reload();
                  }
                },
              });
            }}
          >
            事件认领
          </a>
        ),

        record.dealStatus == 2 && (
          <a
            key="complete"
            onClick={() => {
              setCurrentRow(record);
              handleCompleteModalVisible(true);
            }}
          >
            处理完成
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MonitorTaskEvent, API.PageParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => []}
        request={monitorTaskEventQuery}
        scroll={{ x: 1300 }}
        columns={columns}
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
          <ProDescriptions<API.MonitorTaskEvent>
            column={1}
            title={currentRow?.taskName}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.taskName,
            }}
            columns={columns as ProDescriptionsItemProps<API.MonitorTaskEvent>[]}
          />
        )}
      </Drawer>

      {completeModalVisible && currentRow ? (
        <ModalForm
          title={'异常事件处理结果'}
          width="400px"
          initialValues={currentRow}
          visible={completeModalVisible}
          onVisibleChange={handleCompleteModalVisible}
          onFinish={async (value: any) => {
            const resp = await handleEventComplete({ ...currentRow, ...value });
            if (resp) {
              handleCompleteModalVisible(false);
            }

            if (resp && actionRef.current) {
              actionRef.current?.reload();
            }
          }}
        >
          <ProFormTextArea name="content" placeholder="请输入事件经过" />
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
