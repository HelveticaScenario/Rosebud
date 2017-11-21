import { RosebudJS } from 'rose-vm'
import { stripBOM } from './utils'
import Stats = require('stats.js')

import * as path from 'path'
import * as fs from 'fs-extra'
const mod = require('module')
const electron = require('electron')
import createRenderer from './webgl'
import makeKeycodeExtractor from './keycodeMapping'

declare const rvm: RosebudJS
var stats = new Stats()
stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
stats.dom.classList.add('hidden')
let cachedPackagePath: string | undefined

rvm.print('Player >\nOpen Cartridge >\nselect package.json at\nroot of your cartridge directory')

electron.ipcRenderer.on('reload', () => {
	if (cachedPackagePath != null) {
		loadCart(cachedPackagePath)
		console.log('reload')
	}
})
electron.ipcRenderer.on('open', (_: any, packagePath: string) => {
	cachedPackagePath = packagePath
	loadCart(packagePath)
})
electron.ipcRenderer.on('stats', () => {
	stats.dom.classList.toggle('hidden')
})

const extractKeyCode = makeKeycodeExtractor(rvm)

const currWindow = electron.remote.getCurrentWindow()
let bounds = currWindow.getContentBounds()

currWindow.on('move', ({ sender }: { sender: Electron.BrowserWindow }) => {
	bounds = sender.getContentBounds()
})

currWindow.on('resize', ({ sender }: { sender: Electron.BrowserWindow }) => {
	bounds = sender.getContentBounds()
})

const screen = document.createElement('canvas')

document.body.appendChild(screen)
screen.width = rvm.screenWidth
screen.height = rvm.screenHeight

window.addEventListener('mouseup', _ => {
	rvm.updateBtnState(0, false)
})

screen.addEventListener('mousedown', _ => {
	rvm.updateBtnState(0, true)
})

window.addEventListener('keydown', ev => {
	rvm.updateKeyState(extractKeyCode(ev), true)
})

window.addEventListener('keyup', ev => {
	rvm.updateKeyState(extractKeyCode(ev), false)
})

let hooks: {
	_init?: () => void
	_draw?: (time: number) => void
	_update?: (time: number) => void
} = {}
let paused = false

async function loadCart(packageJsonPath: string) {
	const oldPaused = paused
	paused = true
	try {
		const pkgInfo = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		const cartPath = path.dirname(packageJsonPath)
		const mainFileName = path.resolve(cartPath, pkgInfo.main)
		const main = new mod(mainFileName, module)
		main.filename = mainFileName
		const content = `
	${await fs.readFile(mainFileName, 'utf8')}
	
	if (typeof _draw !== 'undefined') {
		exports._draw = exports._draw || _draw
	} else {
		exports._draw = () => undefined
	}
	
	if (typeof _update !== 'undefined') {
		exports._update = exports._update || _update
	} else {
		exports._update = () => undefined
	}
	
	if (typeof _init !== 'undefined') {
		exports._init = exports._init || _init
	} else {
		exports._init = () => undefined
	}
	`
		rvm.resetSystemMemory()
		currWindow.setTitle(pkgInfo.name || 'Rosebud')
		main._compile(stripBOM(content), mainFileName)
		hooks = main.exports

		hooks._init && hooks._init()
		paused = false
	} catch (e) {
		console.log('Invalid Package')
		paused = oldPaused
	}
}

const canvasRender = createRenderer(screen)

let lastTimestamp = performance.now()

const renderFrame = (time: number) => {
	stats.begin()
	const { x: screenX, y: screenY } = electron.screen.getCursorScreenPoint()
	const { x: winX, y: winY, height, width } = bounds
	const scaleX = screen.width / width // relationship bitmap vs. element for X
	const scaleY = screen.height / height // relationship bitmap vs. element for Y

	rvm.updateMousePos((screenX - winX) * scaleX, (screenY - winY) * scaleY)

	const delta = time - lastTimestamp
	lastTimestamp = time
	if (screen && canvasRender) {
		if (!paused) {
			const frames = Math.round(delta / 16.66) || 1
			const average = delta / frames
			for (let i = 0; i < frames; i++) {
				hooks._update && hooks._update(average)
			}
			hooks._draw && hooks._draw(delta)
		}
		canvasRender(rvm)
	}
	rvm.saveInputFrame()
	stats.end()
	requestAnimationFrame(renderFrame)
}

requestAnimationFrame(renderFrame)
