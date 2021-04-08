import type * as Joi from '@hapi/joi';
import type { ObjectSchema } from '@hapi/joi';
import type { IApi } from 'umi';
import { pluginName } from './utils';

/**
 * 配置
 * @param { IApi } api: umi api方法
 */
function describe(api: IApi): void {
  api.describe({
    id: pluginName,
    key: pluginName,
    config: {
      schema(joi: typeof Joi): ObjectSchema {
        return joi.object({
          ignoreOptions: joi.object(), // 配置忽略的数组
          singular: joi.bool(),        // 是否为单数
          modelName: joi.string(),     // 自定义model文件夹的名称
          esModule: joi.bool(),        // 使用es6模块的方式引入
          ignore: joi.alternatives([   // 忽略的models文件
            joi.array(),
            joi.string()
          ]).match('one'),
          asyncLoadReducers: joi.bool() // 异步导入asyncLoadReducers
        });
      }
    }
  });
}

export default describe;