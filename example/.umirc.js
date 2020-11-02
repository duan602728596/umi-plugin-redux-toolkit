import path from 'path';
import { defineConfig } from 'umi';
import { main } from '../package.json';

const config = {
  plugins: [path.join(__dirname, '..', main)],
  routes: [{
    path: '/index',
    component: path.join(__dirname, 'pages/index.js')
  }]
};

export default defineConfig(config);