/**
 * 配置为es模块时options的content
 * @param { string } optionsContent: options.ts template
 * @param { string } importContent: 模块导入
 * @param { string } ignoreOptions: 忽略
 * @param { string } variableContent: 变量
 */
export function esModuleOptionsContent({ optionsContent, importContent, ignoreOptions, variableContent }: {
  optionsContent: string;
  importContent: string;
  ignoreOptions: string;
  variableContent: string;
}): string {
  return `${ optionsContent }

${ importContent }

export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<sliceOptionsItem> = ${ variableContent };`;
}

/**
 * 配置为commonjs模块时options的content
 * @param { string } optionsContent: options.ts template
 * @param { string } modelsContent: commonjs模块
 * @param { string } ignoreOptions: 忽略
 */
export function commonjsOptionsContent({ optionsContent, ignoreOptions, modelsContent }: {
  optionsContent: string;
  modelsContent: string;
  ignoreOptions: string;
}): string {
  return `${ optionsContent }

export const ignoreOptions: IgnoreOptions = ${ ignoreOptions };
export const sliceOptions: Array<sliceOptionsItem> = ${ modelsContent };`;
}