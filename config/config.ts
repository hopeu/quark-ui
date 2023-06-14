// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  history: { type: 'hash' },
  dll: false,
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // base: '/admin/',
  publicPath: '/admin/',
  // layout: {
  //   name: 'Ant Design Pro',
  //   locale: true,
  // },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  // dynamicImport: {
  //   loading: '@/components/PageLoading/index',
  // },
  dynamicImport: false,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      component: '@/layouts/Index',
      routes: [
        {
          path: '/quark',
          routes: [
            {
              path: '/quark/engine',
              component: './Quark/Engine',
            },
          ],
        },
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
        {
          path: '/sms/send',
          component: '../pages/Sms/Send'
        },
        {
          path: '/',
          redirect: '/quark/engine?api=admin/dashboard/index',
        },
        {
          component: './404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
