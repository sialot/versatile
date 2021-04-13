import { BrowserWindow, app } from 'electron';
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
    //backgroundColor: '#252526',
    minWidth: 450,
    minHeight: 350,
    width: 1280,
    height: 720,
    frame: false
  });
  loadHtml(mainWindow, 'index');
  mainWindow.on('close', () => mainWindow = null);
  mainWindow.webContents.on('crashed', () => console.error('crash'));
  //mainWindow.webContents.openDevTools({mode:'detach'});
}
app.on('ready', () => { createMainWindow() });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => { createMainWindow() })