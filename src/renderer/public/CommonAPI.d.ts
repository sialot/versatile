declare namespace CommonAPI {
    enum WIN_EVENT {
        maximize = "maximize",
        unmaximize = "unmaximize",
        blur = "blur",
        focus = "focus"
    }
}
declare namespace IPC {
    class IpcListener {
        methods: ((event: Electron.IpcRendererEvent, ...args: any[]) => void)[];
        channel: string;
        constructor(channel: string);
        addListener(listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void;
        private _win_event_handler;
    }
    interface IpcListenerMap {
        [key: string]: IpcListener;
    }
    /**
     * IPC消息管理
     */
    export class IpcConnector {
        ipcListenerMap: IpcListenerMap;
        /**
         * 添加消息监听，如果重复添加，方法会依次执行
         * @param channel  频道
         * @param listener  方法
         */
        on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void;
        /**
         * 发送消息
         * @param channel 方法
         * @param args 参数
         */
        send(channel: string, ...args: any[]): void;
    }
    export {};
}
declare const ipcConnector: IPC.IpcConnector;
declare namespace BrowserWindow {
    interface EventListenerMap {
        [key: string]: (() => void)[];
    }
    /**
     * 窗口方法
     */
    export class API {
        eventListenerMap: EventListenerMap;
        constructor();
        on(event: CommonAPI.WIN_EVENT, func: () => void): void;
        private _eventListener;
        maximize(): void;
        unmaximize(): void;
        minimize(): void;
        close(): void;
    }
    export {};
}
declare const browserWindow: BrowserWindow.API;
export { ipcConnector, browserWindow, CommonAPI };
//# sourceMappingURL=CommonAPI.d.ts.map