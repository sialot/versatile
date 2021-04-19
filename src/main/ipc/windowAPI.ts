import { BrowserWindow, app, ipcMain} from 'electron';

// 动作接口
interface WindowAPI { 
    [key: string]: (win:BrowserWindow)=>void
} 

let actionList: WindowAPI = {
  "minimize":(win) => {
    win.minimize();
    return
  },
  "maximize":(win) => {
    win.maximize();
    return
  },
  "unmaximize":(win) => {
    win.unmaximize();
    return
  },
  "close":(win) => {
    win.webContents.closeDevTools();
    win.close();
    return
  },
  "webContents.openDevTools":(win) => {
    win.webContents.openDevTools();
    return
  }
}

function callAPI(win:BrowserWindow, api: string):void {
    actionList[api](win);
    return
}

export default{
  callAPI
}