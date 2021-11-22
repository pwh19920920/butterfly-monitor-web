import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {AlertConfTypeEnum} from "@/services/ant-design-pro/enum";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import {alertConfCreate, alertConfQuery, alertConfUpdate} from "@/services/ant-design-pro/alert.conf";
import {ModalForm} from "@ant-design/pro-form";
import CreateOrUpdateForm from "@/pages/AlertConf/components/UpdateForm";

const handleCreate = async (fields: API.AlertConf) => {
  const hide = message.loading('正在添加');
  try {
    await alertConfCreate({ ...fields });
    hide();
    message.success('保存配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存配置失败!');
    return false;
  }
};

const handleUpdate = async (fields: API.AlertConf) => {
  const hide = message.loading('正在添加');
  try {
    await alertConfUpdate({ ...fields });
    hide();
    message.success('更新配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新配置失败!');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [modifyModalVisible, handleModifyModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.AlertConf>();
  const columns: ProColumns<API.AlertConf>[] = [
    {
      title: '配置key',
      dataIndex: 'confKey',
      hideInSearch: true,
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
      title: '配置值',
      dataIndex: 'confVal',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '配置描述',
      dataIndex: 'confDesc',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '配置类型',
      dataIndex: 'confType',
      valueEnum: AlertConfTypeEnum,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleModifyModalVisible(true);
          }}
        >
          修改
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AlertConf, API.PageParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={alertConfQuery}
        columns={columns}
        rowSelection={{}}
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
        {currentRow?.confKey && (
          <ProDescriptions<API.MonitorDashboard>
            column={2}
            title={currentRow?.confKey}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.confKey,
            }}
            columns={columns as ProDescriptionsItemProps<API.MonitorDashboard>[]}
          />
        )}
      </Drawer>

      <ModalForm
        title="创建配置"
        width="340px"
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        onFinish={async (value: API.AlertConf) => {
          const success = await handleCreate({ ...value, confVal: `${value.confVal}` });
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <CreateOrUpdateForm confType={-1}/>
      </ModalForm>

      {modifyModalVisible && currentRow ? (
        <ModalForm
          title={'更新配置'}
          width="340px"
          initialValues={currentRow}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          onFinish={async (value: API.AlertConf) => {
            const success = await handleUpdate({ ...currentRow, ...value, confVal: `${value.confVal}` });
            if (success) {
              handleModifyModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <CreateOrUpdateForm confType={currentRow.confType}/>
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
