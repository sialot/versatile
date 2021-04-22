/**
 * 面板
 */
export declare class UIPannel {
    ID: string;
    type: string;
    title: string;
    isShow: boolean;
    width: number;
    height: number;
    top: number;
    left: number;
    constructor(type: string, title: string, width: number, height: number);
}
/**
 * 面板管理
 */
declare class PannelManager {
    /**
     * 加载面板配置
     *
     * @returns 面板数组
     */
    loadPannels(): UIPannel[];
}
declare let pannelManager: PannelManager;
export { pannelManager };
//# sourceMappingURL=PannelManager.d.ts.map