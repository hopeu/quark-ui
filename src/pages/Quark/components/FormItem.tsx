import React, {useEffect, useState} from 'react';
import {useModel} from 'umi';
import {get} from '@/services/action';
import {
  ProFormItem,
  ProFormText,
  // ProFormCheckbox,
  // ProFormRadio,
  // ProFormSwitch,
  ProFormTextArea,
  // ProFormSelect,
  ProFormList,
  ProFormDigit,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormGroup,
  // ProFormTimePicker,
} from '@ant-design/pro-form';
import {createFromIconfontCN} from '@ant-design/icons';
import {
  Tree,
  Select,
  TimePicker,
  Checkbox,
  Radio,
  Switch
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';

import ImageUploader from './ImageUploader';
import FileUploader from './FileUploader';
import Search from './Search';
import Map from './Map';
import Geofence from './Geofence';
import Editor from './Editor';
import Cascader from './Cascader';
import FormTable from "@/pages/Quark/components/FormTable";

export interface FormItem {
  key?: any;
  items: any;
  form?: any;
}
const autoFillTimeouts = {};

const FormItem: React.FC<FormItem> = (props: any) => {
  const {initialState} = useModel('@@initialState');
  const IconFont = createFromIconfontCN({
    scriptUrl: initialState?.settings?.iconfontUrl,
  });

  //hack
  const [random, setRandom] = useState(0);
  const [items, setItems] = useState(props.items);
  useEffect(() => {
    setItems(props.items);
  }, [props.items])

  const onChange = (value: any, name: string) => {
    let item = {};
    item[name] = value;
    props.form.setFieldsValue(item);
    setRandom(Math.random);
  };

  const onSelectChange = async (value: any, name: string, load: any = null) => {
    if (load) {
      const promises = items.map(async (item: any, key: any) => {
        if (load.field === item.name && load.api) {
          const result = await get({
            actionUrl: load.api,
            search: value
          });

          item.options = result.data;
        }
        return item;
      });

      const getItems = await Promise.all(promises);
      setItems(getItems);
    }

    const getItem = {};
    getItem[name] = value;
    props.form.setFieldsValue(getItem);
  };
  const onAutoFill = async (value: any, name: string, url: string) => {
    if (url && value) {
      if(autoFillTimeouts[name]){
        clearTimeout(autoFillTimeouts[name]);
      }
      autoFillTimeouts[name] = setTimeout(async () => {
        delete autoFillTimeouts[name];
        const result = await get({
          actionUrl: url ,
          text: value
        });

        if (result.status == 'success') {
          props.form.setFieldsValue(result.data)
        }
       }, 1000);
    }
  };

  // 解析表单item
  const formItemRender = (fromItems: any, field: any = null): any => {
    return (
      fromItems.map((item: any) => {
        let component: any = null;
        switch (item.component) {
          case 'text':
            if (item.type === 'text') {
              component =
                <ProFormText
                  key={item.key}
                  label={item.label}
                  name={field ? [field.name, item.name] : item.name}
                  fieldKey={field ? [field.fieldKey, item.name] : item.name}
                  rules={item.frontendRules}
                  help={item.help ? item.help : undefined}
                  extra={item.extra}
                  tooltip={item.tooltip}
                  placeholder={item.placeholder}
                  fieldProps={{
                    style: item.style ? item.style : [],
                    width: item.width,
                    disabled: item.disabled,
                    maxLength: item.maxLength,
                    addonAfter: item.addonAfter,
                    addonBefore: item.addonBefore,
                    onChange: (e) => {
                      onChange(e.target.value, item.name)
                      onAutoFill(e.target.value, item.name, item.autofill)
                    },
                    allowClear: item.allowClear,
                    size: item.size
                  }}
                />;
            }

            if (item.type === 'password') {
              component =
                <ProFormText.Password
                  key={item.key}
                  label={item.label}
                  name={field ? [field.name, item.name] : item.name}
                  fieldKey={field ? [field.fieldKey, item.name] : item.name}
                  rules={item.frontendRules}
                  help={item.help ? item.help : undefined}
                  extra={item.extra}
                  tooltip={item.tooltip}
                  placeholder={item.placeholder}
                  fieldProps={{
                    style: item.style ? item.style : [],
                    width: item.width,
                    disabled: item.disabled,
                    maxLength: item.maxLength,
                    addonAfter: item.addonAfter,
                    addonBefore: item.addonBefore,
                    onChange: (e) => {
                      onChange(e.target.value, item.name)
                    },
                    allowClear: item.allowClear,
                    size: item.size
                  }}
                />;
            }
            break;
          case 'textArea':
            component =
              <ProFormTextArea
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  style: item.style ? item.style : [],
                  disabled: item.disabled,
                  maxLength: item.maxLength,
                  autoSize: item.autoSize,
                  allowClear: item.allowClear,
                  size: item.size,
                  onChange: (e) => {
                    onChange(e.target.value, item.name)
                  },
                  onKeyPress: (e) => {
                    e.stopPropagation();
                  }
                }}
              />;
            break;
          case 'inputNumber':
            component =
              <ProFormDigit
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                min={item.min}
                max={item.max}
                fieldProps={{
                  precision: item.precision,
                  style: item.style ? item.style : [],
                  width: item.width,
                  disabled: item.disabled,
                  maxLength: item.maxLength,
                  addonAfter: item.addonAfter,
                  addonBefore: item.addonBefore,
                  step: item.step,
                  size: item.size,
                  onChange: (value) => {
                    onChange(value, item.name)
                  },
                }}
              />
            break;
          case 'icon':
            component =
              <ProFormItem
                key={item.name}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                tooltip={item.tooltip}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
                <Select style={item.style ? item.style : []} disabled={item.disabled} placeholder={item.placeholder}>
                  <Select.Option key={0} value={0}>
                    无图标
                  </Select.Option>
                  {item.options.map((i: any) => {
                    return (
                      <Select.Option key={i} value={i}>
                        <IconFont type={i}/> {i}
                      </Select.Option>
                    );
                  })}
                </Select>
              </ProFormItem>
            break;
          case 'hidden':
            component =
              <span key={item.key} style={{display: 'none'}}>
              <ProFormText
                key={item.key}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
              />
            </span>;
            break;
          case 'checkbox':
            component =
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
                <Checkbox.Group
                  style={item.style ? item.style : []}
                  options={item.options}
                  disabled={item.disabled}
                  onChange={(value) => {
                    onChange(value, item.name)
                  }}
                />
              </ProFormItem>;
            break;
          case 'radio':
            component =
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
                <Radio.Group
                  style={item.style ? item.style : []}
                  options={item.options}
                  disabled={item.disabled}
                  onChange={(e) => {
                    onChange(e.target.value, item.name)
                  }}
                />
              </ProFormItem>;
            break;
          case 'image':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                style={item.style}
                tooltip={item.tooltip}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
                <ImageUploader
                  key={item.key}
                  mode={item.mode}
                  title={item.button}
                  limitType={item.limitType}
                  limitSize={item.limitSize}
                  limitNum={item.limitNum}
                  limitWH={item.limitWH}
                  action={item.api}
                />
              </ProFormItem>;
            break;
          case 'file':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                style={item.style}
                tooltip={item.tooltip}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
                <FileUploader
                  key={item.key}
                  title={item.button}
                  limitType={item.limitType}
                  limitSize={item.limitSize}
                  limitNum={item.limitNum}
                  action={item.api}
                />
              </ProFormItem>;
            break;
          case 'switch':
            component =
              <ProFormItem
                key={item.key}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                label={item.label}
                tooltip={item.tooltip}
                rules={item.frontendRules}
                extra={item.extra}
                help={item.help ? item.help : undefined}
                valuePropName={'checked'}
              >
                <Switch
                  style={item.style ? item.style : []}
                  disabled={item.disabled}
                  onChange={(value) => {
                    onChange(value, item.name)
                  }}
                  checkedChildren={item.options.on}
                  unCheckedChildren={item.options.off}
                />
              </ProFormItem>;
            break;
          case 'select':
            component =
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
                <Select
                  placeholder={item.placeholder}
                  style={item.style ? item.style : []}
                  options={item.options}
                  disabled={item.disabled}
                  mode={item.mode}
                  allowClear={item.allowClear}
                  size={item.size}
                  onChange={(value) => {
                    onSelectChange(value, item.name, item.load).then(() => {

                    });
                  }}
                />
              </ProFormItem>;
            break;
          case 'tree':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                valuePropName={'checkedKeys'}
                trigger={'onCheck'}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Tree
                  checkable
                  style={item.style ? item.style : []}
                  treeData={item.treeData}
                />
              </ProFormItem>;
            break;
          case 'cascader':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Cascader
                  api={item.api}
                  size={item.size}
                  options={item.options}
                  style={item.style}
                  placeholder={item.placeholder}
                />
              </ProFormItem>;
            break;
          case 'month':
            component =
              <ProFormDatePicker.Month
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  format: item.format ? item.format : 'YYYY-MM',
                  allowClear: item.allowClear,
                  size: item.size
                }}
              />;
            break;
          case 'date':
            component =
              <ProFormDatePicker
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  format: item.format ? item.format : 'YYYY-MM-DD',
                  allowClear: item.allowClear,
                  size: item.size
                }}
              />;
            break;
          case 'datetime':
            component =
              <ProFormDateTimePicker
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  allowClear: item.allowClear,
                  size: item.size
                }}
              />;
            break;
          case 'dateRange':
            component =
              <ProFormDateRangePicker
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  allowClear: item.allowClear,
                  size: item.size
                }}
              />;
            break;
          case 'datetimeRange':
            component =
              <ProFormDateTimeRangePicker
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
                placeholder={item.placeholder}
                fieldProps={{
                  allowClear: item.allowClear,
                  size: item.size
                }}
              />;
            break;
          case 'time':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
                <TimePicker
                  size={item.size}
                  locale={locale}
                  format={item.format}
                />
              </ProFormItem>;
            break;
          case 'timeRange':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
                <TimePicker.RangePicker
                  size={item.size}
                  locale={locale}
                  format={item.format}
                />
              </ProFormItem>;
            break;
          case 'display':
            component =
              <ProFormItem label={item.label} tooltip={item.tooltip}>
                <span style={item.style ? item.style : []} dangerouslySetInnerHTML={{__html: item.value}}>
                </span>
              </ProFormItem>
            break;
          case 'editor':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Editor
                  key={item.key}
                  height={item?.style?.height}
                  width={item?.style?.width}
                />
              </ProFormItem>;
            break;
          case 'list':
            component =
              <ProFormList
                key={item.name}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                creatorButtonProps={{creatorButtonText: item.button}}
                rules={item.frontendRules}
                // fieldKey={field ? [field.fieldKey, item.name] : item.name}
                // help={item.help ? item.help : undefined}
                // extra={item.extra}
                tooltip={item.tooltip}
              >
                <ProFormGroup>
                  {formItemRender(item.items)}
                </ProFormGroup>
              </ProFormList>
            break;
          case 'search':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Search
                  mode={item.mode}
                  size={item.size}
                  placeholder={item.placeholder}
                  style={item.style}
                  options={item.options}
                  api={item.api}
                  allowClear={item.allowClear}
                />
              </ProFormItem>;
            break;
          case 'map':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Map
                  zoom={item.zoom}
                  mapKey={item.mapKey}
                  style={item.style}
                />
              </ProFormItem>;
            break;
          case 'geofence':
            component =
              <ProFormItem
                key={item.key}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                rules={item.frontendRules}
                help={item.help ? item.help : undefined}
                extra={item.extra}
                tooltip={item.tooltip}
              >
                <Geofence
                  zoom={item.zoom}
                  mapKey={item.mapKey}
                  style={item.style}
                />
              </ProFormItem>;
            break;
          case 'group':
            component =
              <ProFormGroup
                key={item.key}
                title={item.title}
                extra={item.extra}
                tooltip={item.tooltip}
                direction={item.direction}
                children={formItemRender(item.children)}/>
            break;
          case 'table':
            component =
              <FormTable
                key={item.key}
                form={props.form}
                field={field}
                item={item}
              />
            break;
          default:
            component =
              <ProFormItem
                key={item.name}
                label={item.label}
                name={field ? [field.name, item.name] : item.name}
                fieldKey={field ? [field.fieldKey, item.name] : item.name}
                help={item.help ? item.help : undefined}
                extra={item.extra}
              >
              <span key={item.key}>
                无{item.component}组件
              </span>
              </ProFormItem>;
            break;
        }

        // 解析when
        if (item.when) {
          let whenItemComponent: any = null;
          item.when.forEach((whenItem: any) => {
            switch (whenItem.operator) {
              case '=':
                if (props.form.getFieldValue(item.name) == whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case '>':
                if (props.form.getFieldValue(item.name) > whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case '<':
                if (props.form.getFieldValue(item.name) < whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case '<=':
                if (props.form.getFieldValue(item.name) <= whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case '>=':
                if (props.form.getFieldValue(item.name) >= whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case 'has':
                if (props.form.getFieldValue(item.name).indexOf(whenItem.value) != -1) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              case 'in':
                if (whenItem.value.indexOf(props.form.getFieldValue(item.name)) != -1) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
              default:
                if (item.value == whenItem.value) {
                  whenItemComponent = formItemRender(whenItem.items)
                }
                break;
            }
          });

          return <>{component}{whenItemComponent}</>;
        }
        return component;
      })
    )
  }

  return (
    items.length > 0 ? formItemRender(items) : null
  );
}

export default FormItem;
