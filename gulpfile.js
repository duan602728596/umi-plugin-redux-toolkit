const process = require('process');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const tsconfig = require('./tsconfig.json');

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

if (isDevelopment) {
  exports.default = gulp.series(gulp.parallel(tsPluginProject, tsAsyncLoadReducersProject, copy), devWatch);
} else {
  exports.default = gulp.parallel(tsProdPluginProject, tsProdAsyncLoadReducersProject, copy);
}