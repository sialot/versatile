import { BrowserWindow, app, ipcMain} from 'electron';

// 标题栏动作接口
interface ITitleBarActions { 
    [key: string]: (win:BrowserWindow)=>void
} 

// 最小化、最大化、取消最大化、关闭
let actionList: ITitleBarActions = {
  "min-app":(win) => {
    win.minimize();
    return
  },
  "max-app":(win) => {
    win.maximize();
    return
  },
  "unmax-app":(win) => {
    win.unmaximize();
    return
  },
  "close-app":(win) => {
    win.webContents.closeDevTools();
    win.close();
    return
  }
}

// 标题栏动作执行
function doActions(win:BrowserWindow, action: string):void {
    actionList[action](win);
    return
}

export default{
    doActions
}