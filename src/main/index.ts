import { BrowserWindow, app, ipcMain} from 'electron';
import windowAPI from "./ipc/windowAPI"
import path from "path";

// 加载html，目前只对生产模式进行加载
function loadHtml(window: BrowserWindow, name: string) {
  if (process.env.NODE_ENV === 'production') {
    window.loadFile(path.resolve(__dirname, `../renderer/index.html`)).catch(console.error);
    return;
  }
  // 开发模式
  window.loadURL(`http://localhost:9999/dist/renderer/${name}.html`).catch(console.error);
}

let mainWindow: BrowserWindow | null = null;

// 创建窗口
function createMainWindow() {
  if (mainWindow) return;
  mainWindow = new BrowserWindow({    
    minWidth: 450,
    minHeight: 350,
    width: 1280,
    height: 720,
    useContentSize: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
      enableRemoteModule: false // turn off remote
    }
  });
  
  loadHtml(mainWindow, 'index');
}

// 初始化ipc通讯
function initIpc(){

  ipcMain.on('windowAPI', (event, action:string) => {
    if(mainWindow) {
      windowAPI.callAPI(mainWindow, action);
    }
  })
}

// 初始化窗口事件
function initEvents() {

  // 最大化最小化事件通知
  mainWindow?.on('maximize', () => {
    mainWindow?.webContents.send('window-event','maximize');
  })
  mainWindow?.on('unmaximize', () => {
    mainWindow?.webContents.send('window-event','unmaximize');
  })
  
  // 窗口失焦、获焦
  mainWindow?.on('blur', () => {
    mainWindow?.webContents.send('window-event','blur');
  })
  mainWindow?.on('focus', () => {
    mainWindow?.webContents.send('window-event','focus');
  })
  
  mainWindow?.on('close', () => {    
    console.log('closing window!');
    mainWindow = null;
    return true
  });
  mainWindow?.webContents.on('crashed', () => console.error('crash'));
}

app.on('ready', () => { 
  createMainWindow();
  initIpc();
  initEvents();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => { createMainWindow() })