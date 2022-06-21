import path from 'path';
import { defineConfig } from 'umi';
import { main } from '../../package.json';

// const pages = path.join(__dirname, '../src/pages');
const config = {
  plugins: [path.join(__dirname, '../..', main)],
  routes: [
    {
      path: '/',
      component: 'Index/index.js'
    },
    {
      path: '/List',
      component: 'List/index.js'
    },
    {
      path: '/AsyncModel',
      component: 'AsyncModel/AsyncModel.js'
    },
    {
      path: '/RTKQuery',
      component: 'RTKQuery/RTKQuery.js'
    }
  ],
  alias: {
    'umi-plugin-redux-toolkit/dynamicReducers': path.join(__dirname, '../../dynamicReducers.js')
  },
  reduxToolkit: {
    esModule: false,
    asyncLoadReducers: true
  }
};

export default defineConfig(config);