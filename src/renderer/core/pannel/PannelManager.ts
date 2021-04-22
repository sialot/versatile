/**
 * 面板管理方法
 */
import {Pannel, pannelConfig} from '@/core/pannel/config'
import { v4 as uuidv4 } from 'uuid';

/**
 * 面板
 */ 
export class UIPannel {

    ID:string;
    type:string;
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
        this.top = 0;
        this.left = 0;
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
        let rs:UIPannel[] = new Array();
        for(let i=0; i<pannelConfig.length; i++){
            let item = pannelConfig[i]

            let pannel = new UIPannel(item.type, item.title, item.width, item.height)

            if(i > 0){
                let lastPannel = rs[i - 1]
                pannel.left = lastPannel.left + 50;
                pannel.top = lastPannel.top + 50;
            }

            rs.push(pannel)
        }
        return rs;
    }
}
let pannelManager:PannelManager = new PannelManager();
export {
    pannelManager
}
