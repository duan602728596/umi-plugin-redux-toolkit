import * as Joi from '@hapi/joi';
import type { ObjectSchema } from '@hapi/joi';
import type { IApi } from 'umi';

const name: string = 'umi-plugin-redux-toolkit';

/* 配置 */
function describe(api: IApi): void {
  api.describe({
    id: name,
    key: name,
    config: {
      schema(joi: typeof Joi): ObjectSchema {
        return joi.object({
          ignoreOptions: joi.object(), // 配置忽略的数组
          singular: joi.bool(),        // 是否为单数
          modelName: joi.string()      // 自定义model文件夹的名称
        });
      }
    }
  });
}

export default describe;