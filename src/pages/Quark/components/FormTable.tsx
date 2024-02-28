import React, {useRef, useState} from "react";
import {Button, Modal, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ActionType, EditableProTable, ProTable} from "@ant-design/pro-table";
import {ProFormItem} from '@ant-design/pro-form';
import {get} from "@/services/action";

let updateKey = '';

const FormTable: React.FC<any> = ({form, field, item}) => {

  // 可编辑表格选择弹出
  const [editTableModelVisible, setEditTableModelVisible] = useState(false);

  const [editTableType, setEditTableTypee] = useState<'add' | 'replace'>('add');
  // 可编辑表格action
  const editTableActionRef = useRef<ActionType>();
  const actionRef = useRef<ActionType>();

  // 填充的keys Ignore
  const keys: string[] = item.columns.filter((i: { ignore: boolean; }) => !i.ignore)
    .map((i: { key: string; }) => i.key)

  const [data, setDate] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  return (<>
    <ProFormItem
      key={item.key}
      name={field ? [field.name, item.name] : item.name}
      fieldKey={field ? [field.fieldKey, item.name] : item.name}
      label={item.label}
      tooltip={item.tooltip}
      rules={item.frontendRules}
      extra={item.extra}
      help={item.help ? item.help : undefined}
    >
      <EditableProTable
        key={item.key}
        name={field ? [field.name, item.name] : item.name}
        rowKey={item.columns[0].key}
        actionRef={editTableActionRef}
        columns={[{
          title: '序号',
          valueType: 'index',
          editable: false,
          render: (_, __, index) => index + 1
        }, ...item.columns, {
          title: '操作',
          valueType: 'option',
          render: (text, record, index, action) => [
            <a
              key="editable"
              onClick={() => {
                action?.startEditable?.(record[item.columns[0].dataIndex]);
              }}
            >
              编辑
            </a>,
            <a
              key="replacable"
              onClick={() => {
                // console.log(item);
                updateKey = record[item.columns[0].dataIndex];
                setEditTableTypee('replace');
                setEditTableModelVisible(true);
              }}
            >
              更换
            </a>,
            <a
              key="deletabke"
              onClick={() => {
                const tableDataSource = form.getFieldValue(
                  item.name,
                );
                form.setFieldsValue({[item.name]: tableDataSource.filter((i: any) => i[item.columns[0].dataIndex] !== record[item.columns[0].dataIndex])});
              }}
            >
              删除
            </a>,
          ]
        }]}
        toolBarRender={false}
        recordCreatorProps={false}
        editable={{
          type: 'multiple'
        }}>
      </EditableProTable>

      <Button
        type="dashed"
        style={{
          display: 'block',
          margin: '10px 0',
          width: '100%',
        }}
        onClick={() => {
          setEditTableTypee('add');
          setEditTableModelVisible(true);
        }}
        icon={<PlusOutlined/>}>
        添加
      </Button>
    </ProFormItem>
    <Modal
      width={'80%'}
      open={editTableModelVisible}
      centered={true}
      footer={false}
      onCancel={() => setEditTableModelVisible(false)}>
      <ProTable
        columns={item.columns}
        rowKey={item.columns[0].key}
        search={false}
        rowSelection={{
          type: editTableType == 'add' ? 'checkbox' : 'radio', // checkbox, radio
        }}
        actionRef={actionRef}
        tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({selectedRowKeys, onCleanSelected}) => {
          return (<a onClick={() => {
            onCleanSelected();
            setEditTableModelVisible(false);
            if (editTableType == 'add') {
              selectedRowKeys.forEach(key => {
                data.forEach(i => {
                  if (i[item.columns[0].key] === key) {
                    const obj = {};
                    keys.forEach(j => {
                      if (i[j]) {
                        obj[j] = i[j];
                      }
                    })
                    // console.log(obj);
                    editTableActionRef?.current?.addEditRecord(obj);
                  }
                })
              });
            } else {
              const tableDataSource = form.getFieldValue(
                item.name,
              );
              const replaceData = data.filter((i: any) => i[item.columns[0].dataIndex] === selectedRowKeys[0])[0] as any;
              form.setFieldsValue({
                [item.name]: tableDataSource.map((i: any) => {
                  if (i[item.columns[0].dataIndex] === updateKey) {
                    const r = i;
                    keys.forEach(j => {
                      if (i[j]) {
                        r[j] = replaceData[j];
                      }
                    })
                    console.log(r);
                    return r;
                  }
                  return i;
                })
              });
            }
          }
          }>确认选择</a>)
        }}
        request={async (params: any) => {
          const {current: page, pageSize} = params
          const result = await get({
            actionUrl: item.query,
            ...{page, pageSize},
            ...{search: searchKey}
          });
          setDate(result.data.items)
          return Promise.resolve({
            data: result.data.items,
            total: result.data.total,
            success: true,
          });
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true
        }}
        toolbar={{
          title: "搜索查询",
          settings: [],
          search: true,
          onSearch: (keyWords) => {
            // console.log(keyWords);
            setSearchKey(keyWords);
            actionRef?.current?.reload();
          }
        }}>

      </ProTable>
    </Modal></>);
};
export default FormTable;
