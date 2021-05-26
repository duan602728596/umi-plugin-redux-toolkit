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
      component: path.join(pages, 'index.js')
    },
    {
      path: '/asyncModel',
      component: path.join(pages, 'asyncModel.js')
    }
  ],
  alias: {
    'umi-plugin-redux-toolkit/dynamicReducers': path.join(__dirname, '../../dynamicReducers.js')
  },
  reduxToolkit: {
    esModule: true,
    asyncLoadReducers: true
  }
};

export default defineConfig(config);