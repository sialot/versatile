/**
 * 面板配置
 *
 * 面板新增方法
 * 1、@/core/pannel/config/index.ts 添加pannel初始值定义
 * 2、@/components/pannel/中添加 {type}.vue
 * 3、@/core/pannel/config/index.ts defaultPannelList添加面板ID
 */
declare const pannelConfig: PannelConfig;
interface Pannel {
    type: string;
    title: string;
    width: number;
    height: number;
}
interface PannelConfig {
    [key: string]: Pannel;
}
export { Pannel, pannelConfig };
//# sourceMappingURL=index.d.ts.map