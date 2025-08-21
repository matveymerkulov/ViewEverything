// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')
const fs = require("fs")
const path = require('path')

contextBridge.exposeInMainWorld('electron', {
    getDir(dir) {
        const files = fs.readdirSync(dir, {withFileTypes: true})
        const newFiles = []
        for(const file of files) {
            newFiles.push({
                name: file.name,
                isDirectory: file.isDirectory(),
            })
        }
        return newFiles
    }
})
