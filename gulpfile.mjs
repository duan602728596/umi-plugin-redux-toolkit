import process from 'process';
import path from 'path';
import gulp from 'gulp';
import typescript from 'gulp-typescript';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import { metaHelper, requireJson } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);
const tsconfig = await requireJson(path.join(__dirname, 'tsconfig.json'));

const isDevelopment = process.env.NODE_ENV === 'development';
const tsBuildConfig = { ...tsconfig.compilerOptions };

if (!isDevelopment) {
  tsBuildConfig.skipLibCheck = true;
}

const tsBrowserBuildConfig = {
  ...tsBuildConfig,
  module: 'es6',
  target: 'es2015'
};

// 编译ts plugin
function tsPluginProject() {
  const result = gulp.src('src/plugin/**/*.{ts,tsx}')
    .pipe(changed('dist/plugin'))
    .pipe(plumber())
    .pipe(typescript(tsBuildConfig));

  return result.js.pipe(gulp.dest('dist/plugin'));
}

function tsProdPluginProject() {
  const result = gulp.src('src/plugin/**/*.{ts,tsx}')
    .pipe(typescript(tsBuildConfig));

  return result.js.pipe(gulp.dest('dist/plugin'));
}

// 编译ts dynamicReducers
function tsAsyncLoadReducersProject() {
  const result = gulp.src('src/dynamicReducers/**/*.{ts,tsx}')
    .pipe(changed('dist/dynamicReducers'))
    .pipe(plumber())
    .pipe(typescript(tsBrowserBuildConfig));

  return result.js.pipe(gulp.dest('dist/dynamicReducers'));
}

function tsProdAsyncLoadReducersProject() {
  const result = gulp.src('src/dynamicReducers/**/*.{ts,tsx}')
    .pipe(typescript(tsBrowserBuildConfig));

  return result.js.pipe(gulp.dest('dist/dynamicReducers'));
}

// copy
function copy() {
  return gulp.src('src/template/**/*.*')
    .pipe(changed('dist/template'))
    .pipe(gulp.dest('dist/template'));
}

// 监听文件变化
function devWatch() {
  gulp.watch('src/plugin/**/*.{ts,tsx}', tsPluginProject);
  gulp.watch('src/dynamicReducers/**/*.{ts,tsx}', tsAsyncLoadReducersProject);
  gulp.watch('src/template/**/*.*', copy);
}

export default isDevelopment
  ? gulp.series(gulp.parallel(tsPluginProject, tsAsyncLoadReducersProject, copy), devWatch)
  : gulp.parallel(tsProdPluginProject, tsProdAsyncLoadReducersProject, copy);