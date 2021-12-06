import path from 'path';
import { defineConfig } from 'umi';
import { main } from '../../package.json';

const pages = path.join(__dirname, '../src/pages');
const config = {
  webpack5: {},
  plugins: [path.join(__dirname, '../..', main)],
  routes: [
    {
      path: '/index',
      component: path.join(pages, 'Index/index.js')
    },
    {
      path: '/asyncModel',
      component: path.join(pages, 'AsyncModel/AsyncModel.js')
    },
    {
      path: '/RTKQuery',
      component: path.join(pages, 'RTKQuery/RTKQuery.js')
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