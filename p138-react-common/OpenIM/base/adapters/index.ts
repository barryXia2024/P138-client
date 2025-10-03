import OpenIMAdapter from './openimAdapter';
export type { IIMAdapter } from '../types';

// 平台自动解析 .web/.ts 同名文件
export function getIMAdapter() {
  return new OpenIMAdapter();
}

export default getIMAdapter;


