import {Button, Drawer, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import {ModalForm, ProFormInstance} from "@ant-design/pro-form";
import CreateOrUpdateForm from "@/pages/AlertChannel/components/UpdateForm";
import {
  alertChannelCreate,
  alertChannelHandlers,
  alertChannelQuery,
  alertChannelUpdate
} from "@/services/ant-design-pro/alert.channel";
import {AlertChannelFailRouteEnum, AlertChannelTypeEnum} from "@/services/ant-design-pro/enum";

const handleCreate = async (fields: API.AlertChannel) => {
  const hide = message.loading('正在添加');
  try {
    await alertChannelCreate({...fields});
    hide();
    message.success('保存渠道成功');
    return true;
  } catch (error) {
    hide();
    message.error('保存渠道失败!');
    return false;
  }
};

const handleUpdate = async (fields: API.AlertChannel) => {
  const hide = message.loading('正在添加');
  try {
    await alertChannelUpdate({...fields});
    hide();
    message.success('更新渠道成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新渠道失败!');
    return false;
  }
};

const TableList: React.FC = () => {

  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [modifyModalVisible, handleModifyModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const drawRef = useRef<ActionType>();
  const createFormRef = useRef<ProFormInstance<API.AlertChannel>>();
  const updateFormRef = useRef<ProFormInstance<API.AlertChannel>>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.AlertChannel>();
  const [channelHandlers, setChannelHandlers] = useState<API.AlertChannelHandler[]>([]);

  const loadHandlers = async () => {
    const resp = await alertChannelHandlers()
    if (resp.data) {
      setChannelHandlers(resp.data);
    }
  }

  useEffect(() => {
    loadHandlers().then(()=>{});
  }, []);

  const columns: ProColumns<API.AlertChannel>[] = [
    {
      title: '渠道名称',
      dataIndex: 'name',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <a
            onClick={async () => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },{
      title: '渠道类型',
      dataIndex: 'type',
      hideInSearch: true,
      valueEnum: AlertChannelTypeEnum
    },{
      title: '渠道处理器',
      dataIndex: 'handler',
      hideInSearch: true,
    },{
      title: '失败路由',
      dataIndex: 'failRoute',
      hideInSearch: true,
      valueEnum: AlertChannelFailRouteEnum
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            setCurrentRow(record);
            handleModifyModalVisible(true);
          }}
        >
          修改
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AlertChannel, API.PageParams>
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
        request={alertChannelQuery}
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
            <ProDescriptions<API.AlertChannel>
              actionRef={drawRef}
              column={2}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              params={{
                id: currentRow?.name,
              }}
              columns={columns as ProDescriptionsItemProps<API.AlertChannel>[]}
            />
          </>
        )}
      </Drawer>

      {createModalVisible && <ModalForm
        title="创建渠道"
        width="740px"
        visible={createModalVisible}
        formRef={updateFormRef}
        onVisibleChange={handleCreateModalVisible}
        submitter={{
          searchConfig: {
            submitText: '测试并保存',
          },
        }}
        onFinish={async (value: API.AlertChannel) => {
          const success = await handleCreate({...value, params: JSON.stringify(value.paramsObj)});
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <CreateOrUpdateForm  formRef={updateFormRef} channelHandlers={channelHandlers} channelType={-1}/>
      </ModalForm>}

      {modifyModalVisible && currentRow ? (
        <ModalForm
          title={'更新渠道'}
          width="740px"
          initialValues={{...currentRow, paramsObj: JSON.parse(currentRow.params)}}
          formRef={createFormRef}
          visible={modifyModalVisible}
          onVisibleChange={handleModifyModalVisible}
          submitter={{
            searchConfig: {
              submitText: '测试并更新',
            },
          }}
          onFinish={async (value: API.AlertChannel) => {
            const success = await handleUpdate({...currentRow, ...value, params: JSON.stringify(value.paramsObj)});
            if (success) {
              handleModifyModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
                setCurrentRow({...currentRow, ...value});
              }
            }
          }}
        >
          <CreateOrUpdateForm formRef={createFormRef} channelHandlers={channelHandlers} channelType={currentRow.type}/>
        </ModalForm>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default TableList;
