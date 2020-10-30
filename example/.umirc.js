import path from 'path';
import { defineConfig } from 'umi';
import { main } from '../package.json';

export default defineConfig({
  plugins: [path.join(__dirname, '..', main)]
});