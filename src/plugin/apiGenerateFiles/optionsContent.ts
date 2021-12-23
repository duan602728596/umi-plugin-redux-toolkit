import * as path from 'path';

/**
 * 替换文件名
 * @param { string } filename: 文件名
 */
function replaceFileName(filename: string): string {
  return filename.replace(/[~`!@#$%^&*()\-+={}\[\]\\|<>?/,\.]/ig, '_');
}

interface ModuleItem {
  name: string;
  content: string;
}

export interface OptionsContentReturn {
  importContent: string;
  sliceContent: string;
}

/**
 * 创建options文件中的内容
 * @param { Array<string> } models
 * @param { boolean } esModule
 */
export function optionsContent(models: Array<string>, esModule?: boolean): OptionsContentReturn {
  let importContent: string = '';
  let sliceContent: string = '[]';

  if (models.length <= 0) {
    return { importContent, sliceContent };
  }

  if (esModule) {
    // es6
    const modelsEsModuleArray: Array<ModuleItem> = models.map((item: string, index: number): ModuleItem => {
      const parseResult: path.ParsedPath = path.parse(item);      // 解析文件名
      const filename: string = replaceFileName(parseResult.name); // 移除特殊字符，文件名转换成变量
      const variable: string = `model_${ filename }_${ index }`;  // 变量名

      return {
        name: variable,
        content: `import ${ variable } from '${ item }';`
      };
    });

    // 模块导入
    importContent = modelsEsModuleArray.map((item: ModuleItem): string => item.content).join('\n');

    // 变量
    sliceContent = `[\n${ modelsEsModuleArray.map((item: ModuleItem): string => `  ${ item.name }`).join(',\n') }\n]`;
  } else {
    // commonjs
    const modelsModuleRequireArray: Array<string> = models.map((item: string) => `  require('${ item }').default`);

    // 模块导入(commonjs)
    sliceContent = `[\n${ modelsModuleRequireArray.join(',\n') }\n]`;
  }

  return { importContent, sliceContent };
}