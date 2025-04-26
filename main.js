const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Keep false for security
      contextIsolation: true, // Keep true for security
    },
    frame: false, // Make it frameless to use custom toolbar dragging
    transparent: true, // Allow transparency for drawing overlay style
    backgroundColor: '#00000000', // Fully transparent background
    alwaysOnTop: true // Keep the window on top
  });

  mainWindow.loadFile('index.html');

  // Optional: Open DevTools.
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Handle the close request from the renderer/preload script
  ipcMain.on('close-app', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window) {
      window.close();
    }
  });

  // Handle click-through request from renderer/preload script
  ipcMain.on('set-click-through', (event, enabled) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setIgnoreMouseEvents(enabled, { forward: true });
      console.log(`Click-through set to: ${enabled}`); // Log for debugging
    }
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Optional: preload.js content (if you keep the preload line above)
// window.addEventListener('DOMContentLoaded', () => {
//   // Add preload script logic here if needed
// }); 