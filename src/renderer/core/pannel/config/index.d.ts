/**
 * 面板
 */
interface Pannel {
    type: string;
    title: string;
    width: number;
    height: number;
}
/**
 * 面板配置
 *
 * 面板新增方法
 * 1、@/core/pannel/config/index.ts 添加pannel初始值定义
 * 2、@/components/pannel/中添加 {type}.vue
 */
declare const pannelConfig: Pannel[];
export { Pannel, pannelConfig };
//# sourceMappingURL=index.d.ts.map