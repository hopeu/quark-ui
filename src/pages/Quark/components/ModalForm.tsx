import React, {useState} from 'react';
import {useModel, history} from 'umi';
import {get, post} from '@/services/action';
import moment from 'moment';
import {
  Form,
  Button,
  message,
  Modal,
  Space
} from 'antd';
import {createFromIconfontCN} from '@ant-design/icons';
import FormItem from './FormItem';
import {ProForm} from "@ant-design/pro-form";

const ModalForm: React.FC<any> = (props: any) => {
  const [form] = Form.useForm();
  const {initialState} = useModel('@@initialState');
  const IconFont = createFromIconfontCN({
    scriptUrl: initialState.settings.iconfontUrl,
  });

  const [formComponent, setFormComponentState] = useState({
    api: null,
    style: undefined,
    title: undefined,
    width: undefined,
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
  const [loading, setLoading] = useState(false);

  const getComponent = async () => {
    const result = await get({
      actionUrl: props.modal
    });

    if (result.status === 'error') {
      message.error(result.msg);
      return;
    }

    const formComponent = findFormComponent(result.data);
    setFormComponentState(formComponent)

    let initialValues = formComponent.initialValues;
    formComponent.items.map((item: any) => {
      if (item.component === 'time') {
        if (initialValues.hasOwnProperty(item.name)) {
          initialValues[item.name] = moment(initialValues[item.name], item.format);
        }
      }
    });

    form.setFieldsValue(initialValues);
    setVisible(true);
  }

  const findFormComponent: any = (data: any) => {
    if (data.component === 'form') {
      return data;
    }

    if (data.hasOwnProperty('content')) {
      return findFormComponent(data.content);
    }

    let conmpontent = [];

    if (data.hasOwnProperty(0)) {
      conmpontent = (data.map((item: any) => {
        return findFormComponent(item);
      }));
    }

    return conmpontent
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
          onClick={() => {
            getComponent()
          }}
        >
          {props.name}
        </Button>
      break;
    case 'aStyle':
      trigger =
        <a style={props.style} onClick={() => {
          getComponent()
        }}>
          {props.name}
        </a>
      break;
    case 'itemStyle':
      trigger =
        <a style={props.style} onClick={() => {
          getComponent()
        }}>
          {props.name}
        </a>
      break;
    default:
      break;
  }

  const onFinish = async (values: any) => {
    const result = await post({
      actionUrl: formComponent.api,
      ...values
    });

    if (result.status === 'success') {
      setVisible(false)
      form.resetFields();
      message.success(result.msg);
      if (props.current) {
        props.current.reload();
      }
    } else {
      message.error(result.msg);
    }

    if (result.url) {
      history.push(result.url);
    }
  };

  const formButtonRender = (formComponent: any) => {
    if (formComponent.disabledSubmitButton === true) {
      return null;
    }

    return (
      <Space>
        <Button onClick={() => setVisible(false)}>
          取消
        </Button>
        <Button
          loading={loading}
          disabled={loading}
          onClick={() => {
            form.validateFields().then((values: any) => {
              setLoading(true);
              onFinish(values).finally(() => {
                setLoading(false);
              });
            }).catch((info: any) => {
              console.log('Validate Failed:', info);
            });
          }}
          type="primary"
        >
          {formComponent.submitButtonText}
        </Button>
      </Space>
    );
  };

  return (
    <>
      {trigger}
      <Modal
        title={formComponent.title ? formComponent.title : undefined}
        width={formComponent.width ? formComponent.width : undefined}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          form.validateFields().then(values => {
            setLoading(true);
            onFinish(values).finally(() => {
              setLoading(false);
            });
          }).catch(info => {
            console.log('Validate Failed:', info);
          });
        }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            {formButtonRender(formComponent)}
          </div>
        }
      >
        <ProForm
          form={form}
          style={formComponent.style}
          colon={formComponent.colon}
          labelAlign={formComponent.labelAlign}
          name={formComponent.name}
          preserve={formComponent.preserve}
          requiredMark={formComponent.requiredMark}
          scrollToFirstError={formComponent.scrollToFirstError}
          size={formComponent.size}
          layout={formComponent.layout}
          labelCol={formComponent.labelCol}
          wrapperCol={formComponent.wrapperCol}
          submitter={false}
        >
          <FormItem form={form} items={formComponent.items}/>
        </ProForm>
      </Modal>
    </>
  );
}

export default ModalForm;
