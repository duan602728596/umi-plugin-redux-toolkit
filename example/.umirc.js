import path from 'path';
import { defineConfig } from 'umi';
import { main } from '../package.json';

const config = {
  plugins: [path.join(__dirname, '..', main)],
  routes: [
    {
      path: '/index',
      component: path.join(__dirname, 'pages/index.js')
    },
    {
      path: '/asyncModel',
      component: path.join(__dirname, 'pages/asyncModel.js')
    }
  ],
  alias: {
    'umi-plugin-redux-toolkit/dynamicReducers': path.join(__dirname, '../dynamicReducers.js')
  },
  reduxToolkit: {
    esModule: true,
    asyncLoadReducers: true
  }
};

export default defineConfig(config);