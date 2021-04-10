import { BrowserWindow, app } from 'electron';
import path from "path";

// 加载html，目前只对生产模式进行加载
function loadHtml(window: BrowserWindow, name: string) {
  if (process.env.NODE_ENV === 'production') {
    window.loadFile(path.resolve(__dirname, `../renderer/${name}/index.html`)).catch(console.error);
    return;
  }
  // TODO development
}

let mainWindow: BrowserWindow | null = null;

// 创建窗口
function createMainWindow() {
  if (mainWindow) return;
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#252526',
    minWidth: 450,
    minHeight: 350,
    width: 450,
    height: 350
  });
  loadHtml(mainWindow, 'index');
  mainWindow.on('close', () => mainWindow = null);
  mainWindow.webContents.on('crashed', () => console.error('crash'));
}
app.on('ready', () => { createMainWindow() });
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => { createMainWindow() })