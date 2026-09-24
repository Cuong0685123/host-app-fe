const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');
const { fork, exec } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess = null;
const servers = [];

// Đường dẫn file ghi log cho Backend
const logFile = path.join(app.getPath('userData'), 'backend.log');
function writeLog(msg) {
  const line = `[${new Date().toLocaleTimeString()}] ${msg}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch (_) {}
  console.log(msg);
}

// Xác định đường dẫn giữa chế độ dev và bản đóng gói .exe
function getResourcePath(relPath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relPath);
  }
  return path.join(__dirname, '..', relPath);
}

// 1. Tạo máy chủ HTTP tĩnh nội bộ
function startStaticServer(publicPath, port) {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: publicPath,
      headers: [
        {
          source: '**/*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
          ],
        },
      ],
    });
  });

  server.listen(port, 'localhost', () => {
    writeLog(`Port ${port} đang chạy từ: ${publicPath}`);
  });
  servers.push(server);
}

// 2. Kích hoạt toàn bộ hệ thống ngầm
function startAllServices() {
  // A. Chạy ngầm Backend
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'image-search-backend', 'src', 'server.js')
    : path.join(__dirname, '../image-search-backend/src/server.js');

  const backendCwd = app.isPackaged
    ? path.join(process.resourcesPath, 'image-search-backend')
    : path.join(__dirname, '../image-search-backend');

  writeLog(`Khởi động Backend từ: ${backendPath}`);
  writeLog(`Backend Working Directory: ${backendCwd}`);

  try {
    // Dùng fork với chính binary Electron giả lập Node CLI (tương thích hoàn toàn ESM)
    backendProcess = fork(backendPath, [], {
      cwd: backendCwd,
      silent: false,
      execPath: process.execPath,
      env: {
        ...process.env,
        PORT: '5000',
        ELECTRON_RUN_AS_NODE: '1',
      },
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    });

    if (backendProcess.stdout) {
      backendProcess.stdout.on('data', (data) => {
        writeLog(`[Backend stdout]: ${data.toString().trim()}`);
      });
    }

    if (backendProcess.stderr) {
      backendProcess.stderr.on('data', (data) => {
        writeLog(`[Backend stderr ERROR]: ${data.toString().trim()}`);
      });
    }

    backendProcess.on('spawn', () => {
      writeLog('Backend đã được kích hoạt thành công trên tiến trình ngầm.');
    });

    backendProcess.on('exit', (code, signal) => {
      writeLog(`Backend đã thoát với mã code: ${code}, signal: ${signal}`);
    });
  } catch (err) {
    writeLog(`Không thể kích hoạt Backend: ${err.message}`);
  }

  // B. Chạy 4 máy chủ tĩnh nội bộ
  const hostDist = path.join(__dirname, 'dist');
  startStaticServer(hostDist, 3000);
  startStaticServer(getResourcePath('web-links-mfe/dist'), 3002);
  startStaticServer(getResourcePath('gallery-mfe/dist'), 3003);
  startStaticServer(getResourcePath('video-mfr/dist'), 3004);
}

// 3. Mở URL bằng Cốc Cốc
function openWithCocCoc(url) {
  const cocCocPaths = [
    'C:\\Program Files\\CocCoc\\Browser\\Application\\browser.exe',
    'C:\\Program Files (x86)\\CocCoc\\Browser\\Application\\browser.exe',
    path.join(process.env.LOCALAPPDATA || '', 'CocCoc\\Browser\\Application\\browser.exe'),
  ];

  const targetPath = cocCocPaths.find((p) => fs.existsSync(p));

  if (targetPath) {
    exec(`"${targetPath}" "${url}"`);
  } else {
    shell.openExternal(url);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    title: 'OmniSearch Hub',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    openWithCocCoc(url);
    return { action: 'deny' };
  });

  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 2500);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startAllServices();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  servers.forEach((srv) => srv.close());

  if (process.platform !== 'darwin') {
    app.quit();
  }
});