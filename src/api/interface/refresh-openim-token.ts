// 统一的 OpenIM 刷新 token 动态导入封装

export type RefreshFn = typeof import('src/api/interface/auth').refreshOpenimTokenApi;

export async function refreshOpenimTokenApi(
  ...args: Parameters<RefreshFn>
): Promise<ReturnType<RefreshFn>> {
  try {
    const mod = await import('src/api/interface/auth');
    return (mod as any).refreshOpenimTokenApi(...(args as any));
  } catch (_e1) {
    try {
      const mod2 = await import('src/api/interface/users-auth');
      return (mod2 as any).refreshOpenimTokenApi(...(args as any));
    } catch (_e2) {
      throw new Error('未找到可用的 refreshOpenimTokenApi 模块');
    }
  }
}


