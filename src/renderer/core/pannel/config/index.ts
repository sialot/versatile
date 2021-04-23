/**
 * 面板配置
 * 
 * 面板新增方法
 * 1、@/core/pannel/config/index.ts 添加pannel初始值定义
 * 2、@/components/pannel/中添加 {type}.vue
 * 3、@/core/pannel/config/index.ts defaultPannelList添加面板ID
 */
const pannelConfig:PannelConfig = {
    "data-viewer" : {
        type:"data-viewer",
        title:"Vue Store Viewer",
        width:400,
        height:200
    }
}

interface Pannel {
    type:string,
    title:string,
    width:number,
    height:number
}

interface PannelConfig {
    [key:string]:Pannel
}

export {
    Pannel,
    pannelConfig
}