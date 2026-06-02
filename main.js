const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
let mainWindow;
const notesFilePath = path.join(app.getPath('userData'), 'notes.json');
const settingsFilePath = path.join(app.getPath('userData'), 'settings.json');
function readSettings() {
    if (!fs.existsSync(settingsFilePath)) {
        return { fontSize: 16 }; // default settings }
    const raw = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(raw);}
function writeSettings(settings) {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');}
function readNotesFromFile() {
    if (!fs.existsSync(notesFilePath)) return [];
    try {
        const data = fs.readFileSync(notesFilePath, 'utf8');
        return JSON.parse(data);  } catch (e) {
        return [];  }}

function writeNotesToFile(notes) {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 4), 'utf8');}
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 750,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false }
    });
    mainWindow.loadFile('index.html');
    // Build Native OS Application Menus Window Framework Rules Mapping
    const menuTemplate = [
        {  label: 'File',
            submenu: [
                { label: 'New Note', accelerator: 'CmdOrCtrl+N', click: () => mainWindow.webContents.send('menu-new-note') },
                { label: 'Open File', accelerator: 'CmdOrCtrl+O', click: () => mainWindow.webContents.send('menu-open-file') },
                { type: 'separator' },
                { label: 'Save', accelerator: 'CmdOrCtrl+S', click: () => mainWindow.webContents.send('menu-save') },
                { label: 'Save As', accelerator: 'CmdOrCtrl+Shift+S', click: () => mainWindow.webContents.send('menu-save-as') },
                { type: 'separator' },
                { label: 'Quit', role: 'quit'  ]
        },  {
            label: 'Edit',
            submenu: [
                { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
                { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
            ]  },
        {
            label: 'View',
            submenu: [ { role: 'reload' }, { role: 'toggleDevTools' } ] }   ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);}
ipcMain.handle('get-settings', async () => {
    return readSettings();
});
ipcMain.handle('save-settings', async (event, settings) => {
    const current = readSettings();
    const updated = { ...current, ...settings };
    writeSettings(updated);
    return { success: true };
});
ipcMain.handle('get-notes', async () => readNotesFromFile());
ipcMain.handle('save-note-json', async (event, note) => {
    const notes = readNotesFromFile();
    const index = notes.findIndex(n => n.id === note.id);
    if (index === -1) {
        notes.push({ ...note, updatedAt: new Date().toISOString() });
    } else {
        notes[index] = { ...notes[index], ...note, updatedAt: new Date().toISOString() }; }
    writeNotesToFile(notes);
    return true;});
ipcMain.handle('delete-note', async (event, id) => {
    let notes = readNotesFromFile();
    notes = notes.filter(n => n.id !== id);
    writeNotesToFile(notes);
    return true;});
// Legacy Text File Invocation Routing Adapters
ipcMain.handle('new-note', async () => {
    const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to proceed? Unsaved progress will be lost.'
    });
    return { confirmed: choice === 0 };});
ipcMain.handle('open-file', async () => {
    const files = dialog.showOpenDialogSync(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    if (!files) return { success: false };
    const content = fs.readFileSync(files[0], 'utf8');
    return { success: true, filePath: files[0], content };
});
ipcMain.handle('save-as', async (event, text) => {
    const file = dialog.showSaveDialogSync(mainWindow, {
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
    });
    if (file) {
        fs.writeFileSync(file, text, 'utf8');
        return true;
    }
    return false;
});
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();});
