import React, { Component } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons';
import { parse } from 'qs';
import zhCN from 'antd/es/locale/zh_CN';

import {
  InputNumber,
  Tabs,
  Switch,
  Form,
  Select,
  Input,
  Button,
  Radio,
  Upload,
  message,
  Transfer,
  Table,
  Space,
  Drawer,
  ConfigProvider
} from 'antd';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const RadioGroup = Radio.Group;

interface IProps {
  dispatch:Dispatch<any>;
  submitting: boolean;
}

class EditPage extends Component<any> {

  formRef: React.RefObject<any> = React.createRef();

  state = {
    data: {
      goodsBrandSelectedKeys:[],
      goodsBrands:[],
      goodsTypes:[]
    },
    categorys:[],
    status: '',
    loading: false,
    coverId: false,
    attributeTable: {
      dataSource:[],
      pagination:[]
    },
    attributeSearch: [],
    attributeSelectedIds: [],
    attributeSelectedData: [],
    attributeDrawerVisible: false,
    specificationTable:  {
      dataSource:[],
      pagination:[]
    },
    specificationSearch: [],
    specificationSelectedIds: [],
    specificationSelectedData: [],
    specificationDrawerVisible: false,
  };

  // 当挂在模板时，初始化数据
  componentDidMount() {
    // 获得url参数
    let params = parse(window.location.href.split('?')[1])
    let { search } = params;

    // loading
    this.setState({ loading: true });

    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsCategory/edit',
        ...search
      },
      callback: (res:any) => {
        if (res) {
          this.setState({
            data: res.data,
            categorys:res.data.categorys,
            coverId: res.data.cover_id,
            attributeSelectedIds:res.data.attributeSelectedIds,
            attributeSelectedData:res.data.attributeSelectedData,
            specificationSelectedIds:res.data.specificationSelectedIds,
            specificationSelectedData:res.data.specificationSelectedData,
          });

          this.props.dispatch({
            type: 'request/get',
            payload: {
              actionUrl: 'admin/goodsAttribute/search',
              attributeSelectedIds: this.state.attributeSelectedIds,
            },
            callback: (res:any) => {
              if (res) {
                this.setState({ attributeTable: res.data });
              }
            },
          });
      
          this.props.dispatch({
            type: 'request/get',
            payload: {
              actionUrl: 'admin/goodsSpecification/search',
              specificationSelectedIds: this.state.specificationSelectedIds,
            },
            callback: (res:any) => {
              if (res) {
                this.setState({ specificationTable: res.data });
              }
            },
          });

          this.formRef.current.setFieldsValue({
            id:res.data.id,
            title:res.data.title,
            name:res.data.name,
            pid:res.data.pid,
            sort:res.data.sort,
            description:res.data.description,
            index_tpl:res.data.index_tpl,
            lists_tpl:res.data.lists_tpl,
            detail_tpl:res.data.detail_tpl,
            page_num:res.data.page_num,
            status:res.data.status,
            attributes:res.data.attributeSelectedData,
            specifications:res.data.specificationSelectedData,
          });

        }
      },
    });
  }

  attributeShowDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  attributeCloseDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  // 分页切换
  attributeChangePagination = (pagination:any, filters:any, sorter:any) => {
    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsAttribute/search',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.attributeSearch,
        attributeSelectedIds: this.state.attributeSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({ attributeTable: res.data });
        }
      },
    });
  };

  // 搜索
  attributeOnSearch = (values:any) => {
    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsAttribute/search',
        ...this.state.attributeTable.pagination,
        search: values,
        attributeSelectedIds: this.state.attributeSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({ attributeTable: res.data, attributeSearch: values });
        }
      },
    });
  };

  attributeAdd = (index:any) => {
    let attributeSelectedIds = this.state.attributeSelectedIds;
    let attributeSelectedData = this.state.attributeSelectedData;

    // 已经选中attribute的id
    attributeSelectedIds.push(this.state.attributeTable.dataSource[index]['id']);

    // 已经选中attribute的值
    attributeSelectedData.push(this.state.attributeTable.dataSource[index]);

    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsAttribute/search',
        ...this.state.attributeTable.pagination,
        search: this.state.attributeSearch,
        attributeSelectedIds: attributeSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({
            attributeTable: res.data,
            attributeSelectedIds:attributeSelectedIds,
            attributeSelectedData:attributeSelectedData 
          });
          this.formRef.current.setFieldsValue({attributes:this.state.attributeSelectedData});
        }
      },
    });
  };

  attributeRemove = (index:any) => {

    let removeAttributeSelectedId = this.state.attributeSelectedData[index]['id'];

    // 移除选中attribute的id
    let attributeSelectedIds = this.state.attributeSelectedIds.filter(function(item) {
      return item != removeAttributeSelectedId;
    });

    // 移除选中attribute的值
    let attributeSelectedData = this.state.attributeSelectedData.filter(function(item:any) {
      return item.id != removeAttributeSelectedId;
    });

    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsAttribute/search',
        ...this.state.attributeTable.pagination,
        search: this.state.attributeSearch,
        attributeSelectedIds: attributeSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({
            attributeTable: res.data,
            attributeSelectedIds: attributeSelectedIds,
            attributeSelectedData:attributeSelectedData
          });
          this.formRef.current.setFieldsValue({attributes:attributeSelectedData});
        }
      },
    });
  };

  specificationShowDrawer = () => {
    this.setState({
      specificationDrawerVisible: true,
    });
  };

  specificationCloseDrawer = () => {
    this.setState({
      specificationDrawerVisible: false,
    });
  };

  // 分页切换
  specificationChangePagination = (pagination:any, filters:any, sorter:any) => {
    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsSpecification/search',
        pageSize: pagination.pageSize, // 分页数量
        current: pagination.current, // 当前页码
        sortField: sorter.field, // 排序字段
        sortOrder: sorter.order, // 排序规则
        ...filters, // 筛选
        search: this.state.specificationSearch,
        specificationSelectedIds: this.state.specificationSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({ specificationTable: res.data });
        }
      },
    });
  };

  // 搜索
  specificationOnSearch = (values:any) => {
    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsSpecification/search',
        ...this.state.specificationTable.pagination,
        search: values,
        specificationSelectedIds: this.state.specificationSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({ specificationTable: res.data, specificationSearch: values });
        }
      },
    });
  };

  specificationAdd = (index:any) => {
    let specificationSelectedIds = this.state.specificationSelectedIds;
    let specificationSelectedData = this.state.specificationSelectedData;

    // 已经选中specification的id
    specificationSelectedIds.push(this.state.specificationTable.dataSource[index]['id']);

    // 已经选中specification的值
    specificationSelectedData.push(this.state.specificationTable.dataSource[index]);

    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsSpecification/search',
        ...this.state.specificationTable.pagination,
        search: this.state.specificationSearch,
        specificationSelectedIds: specificationSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({
            specificationTable: res.data,
            specificationSelectedIds:specificationSelectedIds,
            specificationSelectedData:specificationSelectedData 
          });
          this.formRef.current.setFieldsValue({specifications:this.state.specificationSelectedData});
        }
      },
    });
  };

  specificationRemove = (index:any) => {

    let removeSpecificationSelectedId = this.state.specificationSelectedData[index]['id'];

    // 移除选中specification的id
    let specificationSelectedIds = this.state.specificationSelectedIds.filter(function(item) {
      return item != removeSpecificationSelectedId;
    });

    // 移除选中specification的值
    let specificationSelectedData = this.state.specificationSelectedData.filter(function(item:any) {
      return item.id != removeSpecificationSelectedId;
    });

    this.props.dispatch({
      type: 'request/get',
      payload: {
        actionUrl: 'admin/goodsSpecification/search',
        ...this.state.specificationTable.pagination,
        search: this.state.specificationSearch,
        specificationSelectedIds: specificationSelectedIds,
      },
      callback: (res:any) => {
        if (res) {
          this.setState({
            specificationTable: res.data,
            specificationSelectedIds: specificationSelectedIds,
            specificationSelectedData: specificationSelectedData
          });
          this.formRef.current.setFieldsValue({specifications:specificationSelectedData});
        }
      },
    });
  };

  onFinish = (values:any) => {
    values['cover_id'] = this.state.coverId;
    this.props.dispatch({
      type: 'request/post',
      payload: {
        actionUrl: 'admin/goodsCategory/save',
        ...values,
      },
    });
  };

  brandFilterOption = (inputValue:any, option:any) => option.title.indexOf(inputValue) > -1;

  brandChange = (targetKeys:any) => {
    let data = this.state.data;
    data.goodsBrandSelectedKeys = targetKeys;
    this.setState({ data: data });
  };

  render() {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };

    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        span: 18,
        offset: 2,
      },
    };

    // 单图片上传模式
    let uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );

    const attributeColumns = [
      {
        title: '属性名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '属性值',
        dataIndex: 'goods_attribute_values',
        key: 'goods_attribute_values',
      },
      {
        title: '操作',
        key: 'action',
        render: (text:any, record:any, index:any) => <a onClick={() => this.attributeAdd(index)}>选择</a>,
      },
    ];

    const specificationColumns = [
      {
        title: '规格名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '规格值',
        dataIndex: 'goods_attribute_values',
        key: 'goods_attribute_values',
      },
      {
        title: '操作',
        key: 'action',
        render: (text:any, record:any, index:any) => <a onClick={() => this.specificationAdd(index)}>选择</a>,
      },
    ];

    return (
      <ConfigProvider locale={zhCN}>
      <PageHeaderWrapper title="编辑商品分类">
        <div style={{ background: '#fff', padding: '10px',paddingTop: '0px' }}>
          <Form
            onFinish={this.onFinish}
            ref={this.formRef}
            initialValues={{
              pid:0,
              sort:0,
              page_num:10,
              status:true
            }}
            style={{ marginTop: 8 }}
          >
          <Tabs>
            <TabPane tab="基本信息" key="1">
              <Form.Item
                style={{display:'none'}}
                name={'id'}
              >
                <Input/>
              </Form.Item>
              <Form.Item {...formItemLayout} label="分类标题" name={'title'} >
                <Input style={{ width: 400 }} placeholder="请输入分类标题" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="分类名称" name={'name'}>
                <Input style={{ width: 200 }} placeholder="请输入分类名称" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="封面图">
                <Upload
                  name={'file'}
                  listType={'picture-card'}
                  showUploadList={false}
                  action={'/api/admin/picture/upload'}
                  headers={{ authorization: 'Bearer ' + sessionStorage['token'] }}
                  beforeUpload={file => {
                    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                      message.error('请上传jpg或png格式的图片!');
                      return false;
                    }
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if (!isLt2M) {
                      message.error('图片大小不可超过2MB!');
                      return false;
                    }
                    return true;
                  }}
                  onChange={info => {
                    if (info.file.status === 'done') {
                      // Get this url from response in real world.
                      if (info.file.response.status === 'success') {
                        let fileList = [];
                        if (info.file.response) {
                          info.file.url = info.file.response.data.url;
                          info.file.uid = info.file.response.data.id;
                          info.file.id = info.file.response.data.id;
                        }
                        fileList[0] = info.file;
                        this.setState({ coverId: fileList });
                      } else {
                        message.error(info.file.response.msg);
                      }
                    }
                  }}
                >
                  {this.state.coverId ? (
                    <img src={this.state.coverId[0]['url']} alt="avatar" width={80} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item {...formItemLayout} label="父节点" name={'pid'}>
                <Select style={{ width: 200 }}>
                  <Option value={0}>{'请选择分类'}</Option>
                  {!!this.state.categorys &&
                    this.state.categorys.map((option:any) => {
                      return <Option key={option.value} value={option.value}>{option.name}</Option>;
                    })}
                </Select>
              </Form.Item>
              <Form.Item {...formItemLayout} label="排序" name={'sort'}>
                <InputNumber style={{ width: 200 }} placeholder="排序" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="描述" name={'description'}>
                <TextArea style={{ width: 400 }} placeholder="请输入描述" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="频道模板" name={'index_tpl'}>
                <Input style={{ width: 400 }} placeholder="请输入频道模板" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="列表模板" name={'lists_tpl'}>
                <Input style={{ width: 400 }} placeholder="请输入列表模板" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="详情模板" name={'detail_tpl'}>
                <Input style={{ width: 400 }} placeholder="请输入详情模板" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="分页数量" name={'page_num'}>
                <InputNumber style={{ width: 200 }} placeholder="请输入分页数量" />
              </Form.Item>
              <Form.Item {...formItemLayout} label="状态" name={'status'} valuePropName={'checked'} >
                <Switch checkedChildren="正常" unCheckedChildren="禁用" />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </TabPane>
            <TabPane tab="关联品牌" key="2">
              <Form.Item {...formItemLayout} name={'brand_ids'}>
                <Transfer
                  titles={['所有品牌', '已选择关联品牌']}
                  dataSource={this.state.data ? this.state.data.goodsBrands : []}
                  showSearch
                  listStyle={{
                    width: 300,
                    height: 300,
                  }}
                  filterOption={this.brandFilterOption}
                  targetKeys={this.state.data ? this.state.data.goodsBrandSelectedKeys : []}
                  onChange={this.brandChange}
                  render={item => item.title}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </TabPane>
            <TabPane tab="关联属性、规格" key="3">
              <Form.List name="attributes">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field,index) => (
                        <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '关联属性' : ''}
                        style={{ margin: 0 }}
                        >
                          <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                            <Form.Item
                              {...field}
                              name={[field.name, 'id']}
                              fieldKey={[field.fieldKey, 'id']}
                              style={{display:'none'}}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'name']}
                              fieldKey={[field.fieldKey, 'name']}
                            >
                              <Input disabled={true} placeholder="请输入属性名称" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'goods_attribute_values']}
                              fieldKey={[field.fieldKey, 'goods_attribute_values']}
                            >
                              <Input disabled={true} placeholder="请输入属性值" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'group']}
                              fieldKey={[field.fieldKey, 'group']}
                            >
                              <Input placeholder="请输入分组名称" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'sort']}
                              fieldKey={[field.fieldKey, 'sort']}
                            >
                              <InputNumber placeholder="排序" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                            >
                              <MinusCircleOutlined
                                onClick={() => {
                                  this.attributeRemove(index);
                                  remove(field.name);
                                }}
                              />
                            </Form.Item>
                          </Space>
                        </Form.Item>
                      ))}
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={this.attributeShowDrawer}
                  style={{ width: '400px' }}
                >
                  <PlusOutlined /> 添加属性
                </Button>
              </Form.Item>
              <Form.List name="specifications">
                {(fields, { add, remove }) => {
                  return (
                    <div>
                      {fields.map((field,index) => (
                        <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? '关联规格' : ''}
                        style={{ margin: 0 }}
                        >
                          <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                            <Form.Item
                              {...field}
                              name={[field.name, 'id']}
                              fieldKey={[field.fieldKey, 'id']}
                              style={{display:'none'}}
                            >
                              <Input />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'name']}
                              fieldKey={[field.fieldKey, 'name']}
                            >
                              <Input disabled={true} placeholder="请输入规格名称" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'goods_attribute_values']}
                              fieldKey={[field.fieldKey, 'goods_attribute_values']}
                            >
                              <Input disabled={true} placeholder="请输入规格值" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'group']}
                              fieldKey={[field.fieldKey, 'group']}
                            >
                              <Input placeholder="请输入分组名称" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'sort']}
                              fieldKey={[field.fieldKey, 'sort']}
                            >
                              <InputNumber placeholder="排序" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                            >
                              <MinusCircleOutlined
                                onClick={() => {
                                  this.specificationRemove(index);
                                  remove(field.name);
                                }}
                              />
                            </Form.Item>
                          </Space>
                        </Form.Item>
                      ))}
                    </div>
                  );
                }}
              </Form.List>
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={this.specificationShowDrawer}
                  style={{ width: '400px' }}
                >
                  <PlusOutlined /> 添加规格
                </Button>
              </Form.Item>
              <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </TabPane>
          </Tabs>
          </Form>

          <Drawer
            title="请选择关联属性"
            closable={false}
            onClose={this.attributeCloseDrawer}
            visible={this.state.attributeDrawerVisible}
            width={500}
          >
            <p>
              <Form
                layout="inline"
                onFinish={this.attributeOnSearch}
                initialValues={{
                  attributeGoodsTypeId:0
                }}
              >
                <Form.Item name={'attributeName'}>
                  <Input placeholder="搜索内容" />
                </Form.Item>
                <Form.Item name={'attributeGoodsTypeId'}>
                  <Select style={{ width: 150 }}>
                    <Option value={0}>{'请选择商品类型'}</Option>
                    {!!this.state.data.goodsTypes &&
                      this.state.data.goodsTypes.map((option:any) => {
                        return <Option key={option.value} value={option.value}>{option.name}</Option>;
                      })}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Form.Item>
              </Form>
              <Table
                columns={attributeColumns}
                dataSource={this.state.attributeTable.dataSource}
                pagination={this.state.attributeTable.pagination}
                onChange={this.attributeChangePagination}
              />
            </p>
          </Drawer>

          <Drawer
            title="请选择关联规格"
            closable={false}
            onClose={this.specificationCloseDrawer}
            visible={this.state.specificationDrawerVisible}
            width={500}
          >
            <p>
              <Form
                layout="inline"
                onFinish={this.specificationOnSearch}
                initialValues={{
                  specificationGoodsTypeId:0
                }}
              >
                <Form.Item name={'specificationName'}>
                  <Input placeholder="搜索内容" />
                </Form.Item>
                <Form.Item name={'specificationGoodsTypeId'}>
                  <Select style={{ width: 150 }}>
                    <Option value={0}>{'请选择商品类型'}</Option>
                    {!!this.state.data.goodsTypes &&
                      this.state.data.goodsTypes.map((option:any) => {
                        return <Option key={option.value} value={option.value}>{option.name}</Option>;
                      })}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    搜索
                  </Button>
                </Form.Item>
              </Form>
              <Table
                columns={specificationColumns}
                dataSource={this.state.specificationTable.dataSource}
                pagination={this.state.specificationTable.pagination}
                onChange={this.specificationChangePagination}
              />
            </p>
          </Drawer>
        </div>
      </PageHeaderWrapper>
      </ConfigProvider>
    );
  }

}

function mapStateToProps(state:any) {
  const { submitting } = state.request;
  return {
    submitting
  };
}

export default connect(mapStateToProps)(EditPage);