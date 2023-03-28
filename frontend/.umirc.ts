import { defineConfig } from 'umi';

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
  ],
  clientLoader: {},
  npmClient: 'pnpm',
  antd: {},
  locale: { default: 'zh-CN' },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  history: { type: 'hash' },
});
