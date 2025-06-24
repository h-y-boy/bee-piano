import { app, BrowserWindow, Menu } from 'electron'

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 768,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })
  win.webContents.openDevTools()
  // 开发环境加载 Vite 服务器
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // 生产环境加载打包后的 HTML
    win.loadFile('dist/renderer/index.html')
  }
}

// 主进程核心启动逻辑（新增）
app.whenReady().then(() => {
  createWindow() // 窗口创建

  Menu.setApplicationMenu(null)
  // macOS 下窗口关闭后重新创建（兼容逻辑）
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 所有窗口关闭时退出应用（Windows/Linux 逻辑）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
