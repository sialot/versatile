/**
 * 面板管理方法
 */
import {Pannel, pannelConfig} from '@/core/pannel/config'
import { v4 as uuidv4 } from 'uuid';

/**
 * 面板位置模式
 */ 
enum POSITON_MODE{
    FLOAT, // 浮动
    LEFT,  // 左
    LEFT_MIDDLE,
    BUTTON,  // 底
    TOP,  // 顶
    RIGHT, // 右侧
    RIGHT_MIDDLE
}

/**
 * 面板
 */ 
export class UIPannel {

    ID:string;
    type:string;
    positionMode:POSITON_MODE;
    title:string;  
    isShow:boolean;
    width:number;
    height:number;
    top:number;
    left:number;

    constructor(type:string, title:string, width:number, height:number ){
        this.ID = uuidv4();
        this.type = type;
        this.title = title;
        this.isShow = true;
        this.width = width;
        this.height = height;
        this.top = 30;
        this.left = 30;
        this.positionMode = POSITON_MODE.FLOAT
    }
}

/**
 * 面板管理
 */
class PannelManager {

    /**
     * 加载面板配置
     * 
     * @returns 面板数组
     */
    public loadPannels():UIPannel[]{
        let rs:UIPannel[] = new Array;
        
        for(const pannelID in pannelConfig) {

            let pannel:UIPannel|null = this.loadCustomerPannelInfo(pannelID);

            // 加载个性化面板数据失败
            if(!pannel){
                let item: Pannel = pannelConfig[pannelID]
                pannel = new UIPannel(item.type, item.title, item.width, item.height)
            } 

            // 默认位置计算
            if(rs.length > 1){
                let lastPannel = rs[rs.length - 1]
                pannel.left = lastPannel.left + 50;
                pannel.top = lastPannel.top + 50;
            }

             rs.push(pannel)
        }
        return rs;
    }

    // 读取已保存的配置 TODO
    private loadCustomerPannelInfo(ID: string):UIPannel | null{
        return null
    }
}
let pannelManager:PannelManager = new PannelManager();
export {
    pannelManager
}
