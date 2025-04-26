const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-app'),
  setClickThrough: (enabled) => ipcRenderer.send('set-click-through', enabled)
}); 