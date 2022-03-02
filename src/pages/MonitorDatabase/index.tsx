import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import {
  monitorDatabaseCreate,
  monitorDatabaseQuery,
  monitorDatabaseUpdate,
} from '@/services/ant-design-pro/monitor.database';
import { ModalForm } from '@ant-design/pro-form';
import CreateOrUpdateForm from '@/pages/MonitorDatabase/components/UpdateForm';
import { DatabaseTypeEnum } from '@/services/ant-design-pro/enum';

const handleCreate = async (fields: API.MonitorDatabase) => {
  const hide = message.loading('正在添加');
  try {
    await monitorDatabaseCreate({ ...fields });
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
const handleUpdate = async (fields: API.MonitorDatabase) => {
  const hide = message.loading('正在添加');
  try {
    await monitorDatabaseUpdate({ ...fields });
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
  const [currentRow, setCurrentRow] = useState<API.MonitorDatabase>();

  const columns: ProColumns<API.MonitorDatabase>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
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
      title: '类型',
      dataIndex: 'type',
      valueEnum: DatabaseTypeEnum,
    },
    {
      title: '地址',
      dataIndex: 'url',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '数据库名',
      dataIndex: 'database',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      hideInSearch: true,
    },
    {
      title: '密码',
      dataIndex: 'password',
      valueType: 'password',
      hideInSearch: true,
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
      <ProTable<API.MonitorDatabase, API.PageParams>
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
        request={monitorDatabaseQuery}
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
          <ProDescriptions<API.MonitorDatabase>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.MonitorDatabase>[]}
          />
        )}
      </Drawer>

      <ModalForm
        title="创建数据源"
        width="740px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value: API.MonitorDatabase) => {
          value.type = Number(value.type);
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
          title={'更新数据源'}
          width="740px"
          initialValues={currentRow}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          onFinish={async (value: API.MonitorDatabase) => {
            value.type = Number(value.type);
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
