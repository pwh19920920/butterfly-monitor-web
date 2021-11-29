import {Button, Drawer, Image, message} from 'antd';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import {ModalForm} from "@ant-design/pro-form";
import CreateOrUpdateForm from "@/pages/AlertGroup/components/UpdateForm";
import {
  alertGroupCreate,
  alertGroupQuery,
  alertGroupUpdate,
  alertGroupUserQueryByGroupId
} from "@/services/ant-design-pro/alert.group";
import {sysUserQueryAll} from "@/services/ant-design-pro/sys.user";

const handleCreate = async (fields: API.AlertGroup) => {
  const hide = message.loading('正在添加');
  try {
    await alertGroupCreate({...fields});
    hide();
    message.success('保存配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存配置失败!');
    return false;
  }
};

const handleUpdate = async (fields: API.AlertGroup) => {
  const hide = message.loading('正在添加');
  try {
    await alertGroupUpdate({...fields});
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
  const [currentRow, setCurrentRow] = useState<API.AlertGroup>();
  const [users, setUsers] = useState<API.SysUser[]>();

  const columns: ProColumns<API.AlertGroup>[] = [
    {
      title: '分组名',
      dataIndex: 'name',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              // 设置已选择得用户
              const resp: API.Resp<string[]> = await alertGroupUserQueryByGroupId(entity.id);
              const user = await sysUserQueryAll();
              if (resp.data && resp.data.length > 0) {
                setUsers(user?.data.filter(item => resp.data.includes(`${item.id}`)))
                setCurrentRow({...entity, groupUsers: resp.data});
                setShowDetail(true);
                return
              }

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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            // 设置已选择得用户
            const resp: API.Resp<string[]> = await alertGroupUserQueryByGroupId(record.id);
            if (resp.data && resp.data.length > 0) {
              setCurrentRow({...record, groupUsers: resp.data});
              handleModifyModalVisible(true);
              return
            }

            setCurrentRow(record);
            handleModifyModalVisible(true);
          }}
        >
          修改
        </a>
      ],
    },
  ];

  const userColumns: ProColumns<API.SysUser>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (_, entity) => {
        return <Image width={20} src={entity.avatar ? entity.avatar : "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"} />;
      },
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.AlertGroup, API.PageParams>
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
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}
        request={alertGroupQuery}
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
        {currentRow?.name && (
          <>
            <ProDescriptions<API.AlertGroup>
              column={2}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<API.AlertGroup>[]}
            />

            <ProTable<API.SysUser>
              headerTitle="查询表格"
              actionRef={actionRef}
              rowKey="id"
              search={false}
              toolBarRender={false}
              dataSource={users}
              columns={userColumns}
              rowSelection={false}
            />
          </>
        )}
      </Drawer>

      <ModalForm
        title="创建分组"
        width="340px"
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        onFinish={async (value: API.AlertGroup) => {
          const success = await handleCreate({...value});
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <CreateOrUpdateForm/>
      </ModalForm>

      {modifyModalVisible && currentRow ? (
        <ModalForm
          title={'更新分组'}
          width="340px"
          initialValues={currentRow}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          onFinish={async (value: API.AlertGroup) => {
            const success = await handleUpdate({...currentRow, ...value});
            if (success) {
              handleModifyModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <CreateOrUpdateForm/>
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
