import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, Row, Spin, Tree } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import { sysRolePermissionQuery } from '@/services/ant-design-pro/sys.role';
import { sysMenuQueryWithOption } from '@/services/ant-design-pro/sys.menu';
import { LoadingOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/lib/tree';
import type { EventDataNode, Key } from 'rc-tree/lib/interface';

export type CreateOrUpdateFormProps = {
  initValues?: API.SysRole;
  onCancel?: () => void;
  onSubmit: (value: { name: string }, permissions: API.SysPermission[]) => Promise<void>;
  visible: boolean;
  title: string;
  width: string;
  onVisibleChange: (visible: boolean) => void;
};

const CreateOrUpdateForm: React.FC<CreateOrUpdateFormProps> = (props) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectPermission, setSelectPermission] = useState<API.SysPermission[]>([]);

  const [form] = Form.useForm();

  const onCheck = (
    checkedKeysValue: string[],
    info: {
      event: 'check';
      node: EventDataNode;
      checked: boolean;
      nativeEvent: MouseEvent;
      checkedNodes: DataNode[];
      checkedNodesPositions?: {
        node: DataNode;
        pos: string;
      }[];
      halfCheckedKeys?: Key[];
    },
  ) => {
    setCheckedKeys(checkedKeysValue);

    const permission: API.SysPermission[] = [];
    const permissionMap = new Map<string, string[]>();
    info.checkedNodes.forEach((value) => {
      // @ts-ignore, 有menuId的一定是option
      const menuId = value.menuId;
      if (!menuId) {
        permission.push({
          menuId: String(value.key),
          option: '',
          roleId: props.initValues?.id,
          independent: true,
          half: false,
        });
      } else {
        let menuOps = permissionMap.get(menuId);
        if (!menuOps) {
          menuOps = [];
        }
        menuOps.push(String(value.key));
        permissionMap.set(menuId, menuOps);
      }
    });
    permissionMap.forEach((value, key) => {
      permission.push({
        menuId: key,
        option: value.join(),
        roleId: props.initValues?.id,
        independent: false,
        half: false,
      });
    });

    // 加入空操作的菜单
    info.halfCheckedKeys?.forEach((value) => {
      permission.push({
        menuId: value,
        option: '',
        roleId: props.initValues?.id,
        independent: true,
        half: true,
      });
    });
    setSelectPermission(permission);
  };

  const reloadPermission = async (roleId: string | number) => {
    const resp = await sysRolePermissionQuery(roleId);
    if (!resp.data) {
      setCheckedKeys([]);
      return;
    }
    const permission: API.SysPermission[] = [];
    const result: string[] = [];
    resp.data.forEach((item: API.SysRolePermission) => {
      permission.push({ ...item });
      if (!item.half && !item.independent) {
        item.options.forEach((op) => {
          result.push(op);
        });
      }

      if (item.independent && !item.half) {
        result.push(`${item.menuId}`);
      }
    });
    setSelectPermission(permission);
    setCheckedKeys(result);
  };

  const reloadTreeData = async () => {
    const resp = await sysMenuQueryWithOption();
    setTreeData(recursionAssignment([...resp.data]));
  };

  function recursionAssignmentOption(menu: API.SysMenu, options: API.SysMenuOption[]): DataNode[] {
    return options.map((item) => {
      return { key: `${item.id}`, title: item.name, menuId: menu.id };
    });
  }

  // DataNode[]
  function recursionAssignment(resp: API.SysMenu[]): DataNode[] {
    if (resp.length === 0) {
      return [];
    }
    return resp.map((item) => {
      const children: DataNode[] = [];
      if (item.children) {
        const result = recursionAssignment(item.children);
        children.push(...result);
      }

      if (item.options) {
        const result = recursionAssignmentOption(item, item.options);
        children.push(...result);
      }
      return { key: item.id, title: item.name, children };
    });
  }

  useEffect(() => {
    // 加载已选择的权限
    if (props.initValues) {
      reloadPermission(props.initValues?.id).then(() => {});
    }

    // 加载菜单
    reloadTreeData().then(() => {});
  }, [props.initValues]);

  return (
    <>
      <Modal
        title={props.title}
        width={props.width}
        visible={props.visible}
        onOk={async () => {
          const values = await form.validateFields();
          return props.onSubmit(values, selectPermission);
        }}
        onCancel={() => {
          props.onVisibleChange(false);
          if (props.onCancel) {
            props.onCancel();
          }
        }}
      >
        {treeData.length == 0 ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          <Form form={form} initialValues={props.initValues}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="name">
                  <ProFormText
                    label="名称"
                    width="md"
                    rules={[
                      {
                        required: true,
                        message: '名称不能为空',
                      },
                    ]}
                    placeholder="请输入名称"
                    name="name"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Tree
                  checkable
                  autoExpandParent={true}
                  // @ts-ignore
                  onCheck={onCheck}
                  defaultExpandAll={true}
                  checkedKeys={checkedKeys}
                  treeData={treeData}
                />
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default CreateOrUpdateForm;
