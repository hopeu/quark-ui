import React, {useState} from 'react';
import {useModel} from 'umi';
import {get} from '@/services/action';
import {
  Button, message,
  Modal
} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import ProDescriptions from "@ant-design/pro-descriptions";
import {itemRender} from "@/pages/Quark/components/Show";

const ModalShow: React.FC<any> = (props: any) => {
  const {initialState} = useModel('@@initialState');
  const IconFont = createFromIconfontCN({
    scriptUrl: initialState?.settings?.iconfontUrl,
  });

  const [showComponent, setShowComponentState] = useState({
    style: undefined,
    title: undefined,
    width: undefined,
    tooltip: undefined,
    bordered: undefined,
    column: undefined,
    loading: false,
    initialValues: {},
    items: [],
    colon: undefined,
    labelAlign: undefined,
    name: undefined,
    preserve: undefined,
    requiredMark: undefined,
    scrollToFirstError: undefined,
    size: undefined,
    layout: undefined,
    labelCol: undefined,
    wrapperCol: undefined,
  });

  const [visible, setVisible] = useState(false);

  const getComponent = async () => {
    const result = await get({
      actionUrl: props.modal
    });

    if (result.status === 'error') {
      message.error(result.msg);
      return;
    }

    const component = findShowComponent(result.data);
    setShowComponentState(component)
    setVisible(true);
  }

  const findShowComponent: any = (data: any) => {
    if (data.component === 'show') {
      return data;
    }

    if (data.hasOwnProperty('content')) {
      return findShowComponent(data.content);
    }

    let components = [];

    if (data.hasOwnProperty(0)) {
      components = (data.map((item: any) => {
        return findShowComponent(item);
      }));
    }

    return components
  }

  let trigger: any = null;
  switch (props.component) {
    case 'buttonStyle':
      trigger =
        <Button
          type={props.type}
          block={props.block}
          danger={props.danger}
          disabled={props.disabled}
          ghost={props.ghost}
          shape={props.shape}
          size={props.size}
          icon={props.icon ? <IconFont type={props.icon}/> : null}
          style={props.style}
          onClick={async () => {
            await getComponent()
          }}
        >
          {props.name}
        </Button>
      break;
    case 'aStyle':
    case 'itemStyle':
      trigger =
        <a style={props.style} onClick={async () => {
          await getComponent()
        }}>
          {props.name}
        </a>
      break;
    default:
      break;
  }

  return (
    <>
      {trigger}
      <Modal
        title={showComponent.title ? showComponent.title : undefined}
        width={showComponent.width ? showComponent.width : undefined}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <ProDescriptions
          style={showComponent.style ? showComponent.style : {margin: '25px', width: '100%'}}
          tooltip={showComponent.tooltip}
          loading={showComponent.loading}
          bordered={showComponent.bordered}
          column={showComponent.column}
          size={showComponent.size}
          layout={showComponent.layout}
          colon={showComponent.colon}>
          {itemRender(showComponent.items)}
        </ProDescriptions>
      </Modal>
    </>
  );
}

export default ModalShow;
