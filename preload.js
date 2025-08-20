// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')
const fs = require("fs")
const path = require('path')

contextBridge.exposeInMainWorld('electron', {
    getDir(dir) {
        return fs.promises.readdir(dir, {withFileTypes: true})
    }
})
