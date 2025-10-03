declare namespace CommonApp {
  interface AppStateStore {
    /**app前台状态*/
    appState: AppStateStatus;
    /**全局loading*/
    globalLoading: boolean;
    /**全局loading文本*/
    globalLoadingText?: string;
    /**设置全局loading*/
    setGlobalLoading: (loading: boolean) => void; // 用于更新 loading 状态
    /**设置全局loading文本*/
    setGlobalLoadingInfo: (loading: boolean, text?: string) => void; // 用于更新 loading 状态
    /**设置app前台状态*/
    setAppState: (appState: AppStateStatus) => void;
  }
}
