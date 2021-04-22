
/**
 * 面板
 */
interface Pannel {
    type:string,
    title:string,
    width:number,
    height:number
}

/**
 * 面板配置
 * 
 * 面板新增方法
 * 1、@/core/pannel/config/index.ts 添加pannel初始值定义
 * 2、@/components/pannel/中添加 {type}.vue
 */
const pannelConfig:Pannel[] = [
    {
        type:"data-viewer",
        title:"Vue Store Viewer",
        width:1000,
        height:500
    },
    {
        type:"data-viewer",
        title:"Vue Store Viewer",
        width:1000,
        height:500
    }
]

export {
    Pannel,
    pannelConfig
}