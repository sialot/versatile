/**
 * 面板位置模式
 */
declare enum POSITON_MODE {
    FLOAT = 0,
    LEFT = 1,
    LEFT_MIDDLE = 2,
    BUTTON = 3,
    TOP = 4,
    RIGHT = 5,
    RIGHT_MIDDLE = 6
}
/**
 * 面板
 */
export declare class UIPannel {
    ID: string;
    type: string;
    positionMode: POSITON_MODE;
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
    private loadCustomerPannelInfo;
}
declare let pannelManager: PannelManager;
export { pannelManager };
//# sourceMappingURL=PannelManager.d.ts.map