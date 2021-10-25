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
import CreateOrUpdateForm from '@/pages/MonitorDashboard/components/UpdateForm';
import {
  monitorDashboardCreate,
  monitorDashboardQuery,
  monitorDashboardUpdate
} from "@/services/ant-design-pro/monitor.dashboard";

const handleCreate = async (fields: API.MonitorDashboard) => {
  const hide = message.loading('正在添加');
  try {
    await monitorDashboardCreate({ ...fields });
    hide();
    message.success('保存数据库源成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存数据库源失败!');
    return false;
  }
};

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleUpdate = async (fields: API.MonitorDashboard) => {
  const hide = message.loading('正在添加');
  try {
    await monitorDashboardUpdate({ ...fields });
    hide();
    message.success('更新数据库源成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新数据库源失败!');
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
  const [currentRow, setCurrentRow] = useState<API.MonitorDashboard>();

  const columns: ProColumns<API.MonitorDashboard>[] = [
    {
      title: '名称',
      dataIndex: 'name',
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
      title: '英文名',
      dataIndex: 'slug',
    },
    {
      title: '地址',
      dataIndex: 'url',
    },
    {
      title: 'uid',
      dataIndex: 'uid',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MonitorDashboard, API.PageParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={false}
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
        request={monitorDashboardQuery}
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
        {currentRow?.name && (
          <ProDescriptions<API.MonitorDashboard>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.MonitorDashboard>[]}
          />
        )}
      </Drawer>

      <ModalForm
        title="创建Dashboard"
        width="740px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value: API.MonitorDashboard) => {
          const success = await handleCreate({ ...value });
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <CreateOrUpdateForm />
      </ModalForm>

      {modifyModalVisible && currentRow ? (
        <ModalForm
          title={'更新Dashboard'}
          width="740px"
          initialValues={currentRow}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          onFinish={async (value: API.MonitorDashboard) => {
            const success = await handleUpdate({ ...currentRow, ...value });
            if (success) {
              handleModifyModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <CreateOrUpdateForm />
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
