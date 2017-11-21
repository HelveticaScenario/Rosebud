import { app, BrowserWindow, Menu, MenuItem, dialog } from 'electron'
import * as path from 'path'
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
// import { enableLiveReload } from 'electron-compile'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null

const isDevMode = process.execPath.match(/[\\/]electron/)

// if (isDevMode) {
// 	enableLiveReload({ strategy: 'react-hmr' })
// }

const template: Electron.MenuItemConstructorOptions[] = [
	{
		label: 'Player',
		submenu: [
			{
				label: 'Open Cartridge',
				accelerator: process.platform === 'darwin' ? 'Command+O' : 'Ctrl+O',
				click(_item, focusedWindow) {
					if (focusedWindow) {
						dialog.showOpenDialog(
							{
								title: 'Open the package.json at the root of your cartridge',
								properties: ['openFile', 'showHiddenFiles'],
								filters: [{ name: 'package.json', extensions: ['json'] }],
							},
							(paths: string[]) => {
								if (paths && paths.length) {
									focusedWindow.webContents.send('open', paths[0])
								}
							}
						)
					}
				},
			},
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click(_item, focusedWindow) {
					if (focusedWindow) focusedWindow.webContents.send('reload')
				},
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click(_, focusedWindow) {
					if (focusedWindow) focusedWindow.webContents.toggleDevTools()
				},
			},
			{
				label: 'Toggle Stats',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+S' : 'Ctrl+Shift+S',
				click(_, focusedWindow) {
					if (focusedWindow) focusedWindow.webContents.send('stats')
				},
			},

		],
	},
	{
		role: 'window',
		submenu: [
			{
				role: 'minimize',
			},
			{
				role: 'close',
			},
		],
	},
]

if (process.platform === 'darwin') {
	const name = app.getName()
	template.unshift({
		label: name,
		submenu: [
			{
				role: 'about',
			},
			{
				type: 'separator',
			},
			{
				role: 'services',
				submenu: [],
			},
			{
				type: 'separator',
			},
			{
				role: 'hide',
			},
			{
				role: 'hideothers',
			},
			{
				role: 'unhide',
			},
			{
				type: 'separator',
			},
			{
				role: 'quit',
			},
		],
	})

	// Window menu.
	template[2].submenu = [
		{
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close',
		},
		{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize',
		},
		{
			label: 'Zoom',
			role: 'zoom',
		},
		{
			type: 'separator',
		},
		{
			label: 'Bring All to Front',
			role: 'front',
		},
	]
}

const createWindow = async () => {
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// Create the browser window.
	mainWindow = new BrowserWindow({
		title: 'Rosebud',
		width: 640,
		height: 360,
		useContentSize: true,
		acceptFirstMouse: true,
		webPreferences: {
			preload: path.resolve(__dirname, 'preload.js'),
		},
	})

	mainWindow.setAspectRatio(640 / 360, { width: 0, height: 0 })

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/../../src/index.html`)

	// Open the DevTools.
	if (isDevMode) {
		// await installExtension(REACT_DEVELOPER_TOOLS)
		// require('devtron').install()
	}
	// mainWindow.webContents.openDevTools({ mode: 'detach' })

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
