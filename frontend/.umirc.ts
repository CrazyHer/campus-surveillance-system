import { defineConfig } from 'umi';
import zhCN from 'antd/locale/zh_CN';

export default defineConfig({
  plugins: ['@umijs/plugins/dist/antd', '@umijs/plugins/dist/locale'],
  routes: [
    { path: '/', component: '@/pages/index', layout: false },
    { path: '/login', component: '@/pages/login', layout: false },
    {
      path: '/campusState',
      component: '@/pages/campusState',
    },
    { path: '/monitScreen', component: '@/pages/monitScreen' },
    { path: '/alarms', component: '@/pages/alarms' },
    { path: '/userInfo', component: '@/pages/userInfo' },
    { path: '/admin/mapManage', component: '@/pages/admin/mapManage' },
    { path: '/admin/camerasManage', component: '@/pages/admin/camerasManage' },
    {
      path: '/admin/alarmRulesManage',
      component: '@/pages/admin/alarmRulesManage',
    },
    { path: '/admin/usersManage', component: '@/pages/admin/usersManage' },
    { paht: '/*', redirect: '/' },
  ],
  clientLoader: {},
  npmClient: 'pnpm',
  antd: { configProvider: { locale: zhCN } },
  locale: { default: 'zh-CN', antd: false, baseSeparator: '-' },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
  metas: [{ name: 'viewport', content: 'width=1080, initial-scale=1' }],
});
