const { app, BrowserWindow } = require('electron');

// 创建窗口
function createWindow() {
    let win = new BrowserWindow({
        backgroundColor: '#252526',
        width: 800,
        height: 600
    });

    // 如果路径或者参数中含有中文，需要对路径进行编码处理
    win.loadFile('./index.html').catch(console.error);

    // 打开开发者工具
    //win.webContents.openDevTools();

    // 监听窗口的关闭事件，释放窗口对象
    win.on('closed', () => {
        win = null;
    });
}

// 创建窗口
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {

    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (!win) createWindow();
});