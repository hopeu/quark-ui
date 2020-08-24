import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  title: false,
  history: { type: 'hash' },
  dll: false,
  hash: true,
  dynamicImport: false,
  antd: {},
  dva: {
    hmr: true,
  },
  base: '/admin/',
  publicPath: '/admin/',
  routes: [
    {
      path: '/login',
      component: '../layouts/LoginLayout',
      routes: [{ path: '/login', component: '../pages/Auth/Login' }],
    },
    {
      path: '/',
      component: '../layouts/AdminLayout',
      routes: [
        { path: '/', component: '../pages/Dashboard/Index' },
        { path: '/index', component: '../pages/Dashboard/Index' },
        { path: '/dashboard/index', component: '../pages/Dashboard/Index' },
        { path: '/upgrade/index', component: '../pages/Upgrade/Index' },
        { path: '/quark/engine', component: '../pages/Quark/Engine' },
        { path: '/account', component: '../pages/Account/Settings/Info' },
        {
          path: '/account/settings',
          component: '../pages/Account/Settings/Info',
        },
        {
          path: '/account/settings/info',
          component: '../pages/Account/Settings/Info',
        },
        {
          path: '/account/settings/security',
          component: '../pages/Account/Settings/Security',
        },
        { path: '/sms/send', component: '../pages/Sms/Send' },
        {
          path: '/goodsAttribute/create',
          component: '../pages/GoodsAttribute/Create',
        },
        {
          path: '/goodsAttribute/edit',
          component: '../pages/GoodsAttribute/Edit',
        },
        {
          path: '/goodsSpecification/create',
          component: '../pages/GoodsSpecification/Create',
        },
        {
          path: '/goodsSpecification/edit',
          component: '../pages/GoodsSpecification/Edit',
        },
        {
          path: '/goodsCategory/create',
          component: '../pages/GoodsCategory/Create',
        },
        {
          path: '/goodsCategory/edit',
          component: '../pages/GoodsCategory/Edit',
        },
        { path: '/goods/create', component: '../pages/Goods/Create' },
        { path: '/goods/imageCreate', component: '../pages/Goods/ImageCreate' },
        { path: '/goods/imageEdit', component: '../pages/Goods/ImageEdit' },
        { path: '/goods/complete', component: '../pages/Goods/Complete' },
        { path: '/goods/edit', component: '../pages/Goods/Edit' },
        { path: '/goodsOrder/index', component: '../pages/GoodsOrder/Index' },
        { path: '/goodsOrder/info', component: '../pages/GoodsOrder/Info' },
        {
          path: '/goodsOrder/quickDelivery',
          component: '../pages/GoodsOrder/QuickDelivery',
        },
        {
          path: '/goodsOrder/virtualOrderIndex',
          component: '../pages/GoodsOrder/VirtualOrderIndex',
        },
        {
          path: '/goodsOrder/deliveryIndex',
          component: '../pages/GoodsOrder/DeliveryIndex',
        },
      ],
    },
  ],
  proxy: {
    '/api': {
      target: 'http://www.project.com/',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
  },
});
