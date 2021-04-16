/**
 * APP全局API
 */
const { ipcRenderer } = require('electron')

// 通用方法
namespace CommonAPI{
    export enum WIN_EVENT {
        maximize = 'maximize',
        unmaximize = 'unmaximize',
        blur = 'blur',
        focus = 'focus'
    }
}

// IPC通信
namespace IPC {

    // 频道监听器
    class IpcListener {

        // 事件响应存储map
        methods:((event: Electron.IpcRendererEvent, ...args: any[]) => void)[] = [];

        // 当前频道
        channel:string = "";

        // 构造函数
        constructor (channel:string){
            this.channel = channel;
            ipcRenderer.on(channel, this._win_event_handler.bind(this));
        }

        // 注册监听
        public addListener(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void{
            this.methods.push(listener);
        }

        // 事件处理
        private _win_event_handler (event: Electron.IpcRendererEvent, ...args: any[]): void{

            for(let i=0; i<this.methods.length; i++){
                this.methods[i](event, ...args);
            }
        }
    }

    // ipc事件响应方法存储
    interface IpcListenerMap {
        [key: string]: IpcListener
    }

    /**
     * IPC消息管理
     */
    export class IpcConnector {

        ipcListenerMap:IpcListenerMap = {}

        /**
         * 添加消息监听，如果重复添加，方法会依次执行
         * @param channel  频道
         * @param listener  方法
         */
        public on(channel:string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void{

            if(!(channel in this.ipcListenerMap)){
                this.ipcListenerMap[channel] = new IpcListener(channel);
            }

            this.ipcListenerMap[channel].addListener(listener);
        }

        /**
         * 发送消息
         * @param channel 方法
         * @param args 参数
         */
        public send(channel:string, ...args:any[]): void{
            ipcRenderer.send(channel, args)
        }
    }
}
const ipcConnector = new IPC.IpcConnector();

// 浏览器窗口
namespace BrowserWindow {
    
    // 事件监听存储
    interface EventListenerMap{
        [key:string]:(()=>void)[]
    }

    /**
     * 窗口方法
     */
    export class API{

        eventListenerMap:EventListenerMap = {};
    
        constructor(){

            // 接收窗口事件
            ipcConnector.on('window-event', this._eventListener.bind(this));
        }

        // 注册事件监听    
        public on(event: CommonAPI.WIN_EVENT, func:()=>void):void{
            if(!(event in this.eventListenerMap)){
                this.eventListenerMap[event] = new Array()
            }
            this.eventListenerMap[event].push(func)

            console.log(this.eventListenerMap);
        }

        // 执行监听事件
        private _eventListener(event: Electron.IpcRendererEvent, flag:string){
            
            for(let i=0; i<this.eventListenerMap[flag].length; i++){
                this.eventListenerMap[flag][i]();
            }
        }

        // 最大化
        public maximize():void{
            ipcConnector.send('title-bar-actions', 'max-app');
        }
    
        // 最大化还原
        public unmaximize():void{
            ipcConnector.send('title-bar-actions', 'unmax-app');
        }
    
        // 最小化
        public minimize():void{
            ipcConnector.send('title-bar-actions', 'min-app');
        }
    
        // 关闭
        public close():void{
            ipcConnector.send('title-bar-actions', 'close-app');
        }
    }
}
const browserWindow = new BrowserWindow.API();

export {
    ipcConnector,
    browserWindow,
    CommonAPI
}
