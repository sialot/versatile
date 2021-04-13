import { BrowserWindow, app, ipcMain} from 'electron';
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
    webPreferences: {
      nodeIntegration: true
    },
    minWidth: 450,
    minHeight: 350,
    width: 1280,
    height: 720,
    useContentSize: true,
    frame: false
  });
  loadHtml(mainWindow, 'index');
  mainWindow.on('close', () => mainWindow = null);
  mainWindow.webContents.on('crashed', () => console.error('crash'));
}

// 初始化ui组件
function initUI() {

  ipcMain.on('close-app', () => {
    if (mainWindow) {
      mainWindow.close()
    }
  })

  ipcMain.on('min-app', () => {
    if (mainWindow) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('max-app', () => {
    if (mainWindow) {
      mainWindow.maximize()
    }
  })
}

app.on('ready', () => { 
  createMainWindow();
  initUI();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => { createMainWindow() })