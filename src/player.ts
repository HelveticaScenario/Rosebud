import { RosebudJS, Keycodes } from 'rose-vm'
const Stats = require('stats.js')
import * as path from 'path'
import * as fs from 'fs'
const mod = require('module')
const electron = require('electron')
import createRenderer from './webgl'
var stats = new Stats()
stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

let KEY_CODE_MAP: { [keyCode: number]: number } = {}

KEY_CODE_MAP[3] = rvm.key.codes.PauseBreak // VK_CANCEL 0x03 Control-break processing
KEY_CODE_MAP[8] = rvm.key.codes.Backspace
KEY_CODE_MAP[9] = rvm.key.codes.Tab
KEY_CODE_MAP[13] = rvm.key.codes.Enter
KEY_CODE_MAP[16] = rvm.key.codes.Shift
KEY_CODE_MAP[17] = rvm.key.codes.Ctrl
KEY_CODE_MAP[18] = rvm.key.codes.Alt
KEY_CODE_MAP[19] = rvm.key.codes.PauseBreak
KEY_CODE_MAP[20] = rvm.key.codes.CapsLock
KEY_CODE_MAP[27] = rvm.key.codes.Escape
KEY_CODE_MAP[32] = rvm.key.codes.Space
KEY_CODE_MAP[33] = rvm.key.codes.PageUp
KEY_CODE_MAP[34] = rvm.key.codes.PageDown
KEY_CODE_MAP[35] = rvm.key.codes.End
KEY_CODE_MAP[36] = rvm.key.codes.Home
KEY_CODE_MAP[37] = rvm.key.codes.LeftArrow
KEY_CODE_MAP[38] = rvm.key.codes.UpArrow
KEY_CODE_MAP[39] = rvm.key.codes.RightArrow
KEY_CODE_MAP[40] = rvm.key.codes.DownArrow
KEY_CODE_MAP[45] = rvm.key.codes.Insert
KEY_CODE_MAP[46] = rvm.key.codes.Delete

KEY_CODE_MAP[48] = rvm.key.codes.Key0
KEY_CODE_MAP[49] = rvm.key.codes.Key1
KEY_CODE_MAP[50] = rvm.key.codes.Key2
KEY_CODE_MAP[51] = rvm.key.codes.Key3
KEY_CODE_MAP[52] = rvm.key.codes.Key4
KEY_CODE_MAP[53] = rvm.key.codes.Key5
KEY_CODE_MAP[54] = rvm.key.codes.Key6
KEY_CODE_MAP[55] = rvm.key.codes.Key7
KEY_CODE_MAP[56] = rvm.key.codes.Key8
KEY_CODE_MAP[57] = rvm.key.codes.Key9

KEY_CODE_MAP[65] = rvm.key.codes.KeyA
KEY_CODE_MAP[66] = rvm.key.codes.KeyB
KEY_CODE_MAP[67] = rvm.key.codes.KeyC
KEY_CODE_MAP[68] = rvm.key.codes.KeyD
KEY_CODE_MAP[69] = rvm.key.codes.KeyE
KEY_CODE_MAP[70] = rvm.key.codes.KeyF
KEY_CODE_MAP[71] = rvm.key.codes.KeyG
KEY_CODE_MAP[72] = rvm.key.codes.KeyH
KEY_CODE_MAP[73] = rvm.key.codes.KeyI
KEY_CODE_MAP[74] = rvm.key.codes.KeyJ
KEY_CODE_MAP[75] = rvm.key.codes.KeyK
KEY_CODE_MAP[76] = rvm.key.codes.KeyL
KEY_CODE_MAP[77] = rvm.key.codes.KeyM
KEY_CODE_MAP[78] = rvm.key.codes.KeyN
KEY_CODE_MAP[79] = rvm.key.codes.KeyO
KEY_CODE_MAP[80] = rvm.key.codes.KeyP
KEY_CODE_MAP[81] = rvm.key.codes.KeyQ
KEY_CODE_MAP[82] = rvm.key.codes.KeyR
KEY_CODE_MAP[83] = rvm.key.codes.KeyS
KEY_CODE_MAP[84] = rvm.key.codes.KeyT
KEY_CODE_MAP[85] = rvm.key.codes.KeyU
KEY_CODE_MAP[86] = rvm.key.codes.KeyV
KEY_CODE_MAP[87] = rvm.key.codes.KeyW
KEY_CODE_MAP[88] = rvm.key.codes.KeyX
KEY_CODE_MAP[89] = rvm.key.codes.KeyY
KEY_CODE_MAP[90] = rvm.key.codes.KeyZ

KEY_CODE_MAP[93] = rvm.key.codes.ContextMenu

KEY_CODE_MAP[96] = rvm.key.codes.NumPad0
KEY_CODE_MAP[97] = rvm.key.codes.NumPad1
KEY_CODE_MAP[98] = rvm.key.codes.NumPad2
KEY_CODE_MAP[99] = rvm.key.codes.NumPad3
KEY_CODE_MAP[100] = rvm.key.codes.NumPad4
KEY_CODE_MAP[101] = rvm.key.codes.NumPad5
KEY_CODE_MAP[102] = rvm.key.codes.NumPad6
KEY_CODE_MAP[103] = rvm.key.codes.NumPad7
KEY_CODE_MAP[104] = rvm.key.codes.NumPad8
KEY_CODE_MAP[105] = rvm.key.codes.NumPad9
KEY_CODE_MAP[106] = rvm.key.codes.NumPadMultiply
KEY_CODE_MAP[107] = rvm.key.codes.NumPadAdd
KEY_CODE_MAP[108] = rvm.key.codes.NumPadSeparator
KEY_CODE_MAP[109] = rvm.key.codes.NumPadSubtract
KEY_CODE_MAP[110] = rvm.key.codes.NumPadDecimal
KEY_CODE_MAP[111] = rvm.key.codes.NumPadDivide

KEY_CODE_MAP[112] = rvm.key.codes.F1
KEY_CODE_MAP[113] = rvm.key.codes.F2
KEY_CODE_MAP[114] = rvm.key.codes.F3
KEY_CODE_MAP[115] = rvm.key.codes.F4
KEY_CODE_MAP[116] = rvm.key.codes.F5
KEY_CODE_MAP[117] = rvm.key.codes.F6
KEY_CODE_MAP[118] = rvm.key.codes.F7
KEY_CODE_MAP[119] = rvm.key.codes.F8
KEY_CODE_MAP[120] = rvm.key.codes.F9
KEY_CODE_MAP[121] = rvm.key.codes.F10
KEY_CODE_MAP[122] = rvm.key.codes.F11
KEY_CODE_MAP[123] = rvm.key.codes.F12
KEY_CODE_MAP[124] = rvm.key.codes.F13
KEY_CODE_MAP[125] = rvm.key.codes.F14
KEY_CODE_MAP[126] = rvm.key.codes.F15
KEY_CODE_MAP[127] = rvm.key.codes.F16
KEY_CODE_MAP[128] = rvm.key.codes.F17
KEY_CODE_MAP[129] = rvm.key.codes.F18
KEY_CODE_MAP[130] = rvm.key.codes.F19

KEY_CODE_MAP[144] = rvm.key.codes.NumLock
KEY_CODE_MAP[145] = rvm.key.codes.ScrollLock

KEY_CODE_MAP[186] = rvm.key.codes.Semicolon
KEY_CODE_MAP[187] = rvm.key.codes.Equal
KEY_CODE_MAP[188] = rvm.key.codes.Comma
KEY_CODE_MAP[189] = rvm.key.codes.Minus
KEY_CODE_MAP[190] = rvm.key.codes.Dot
KEY_CODE_MAP[191] = rvm.key.codes.Slash
KEY_CODE_MAP[192] = rvm.key.codes.Backtick
KEY_CODE_MAP[193] = rvm.key.codes.AbntC1
KEY_CODE_MAP[194] = rvm.key.codes.AbntC2
KEY_CODE_MAP[219] = rvm.key.codes.OpenSquareBracket
KEY_CODE_MAP[220] = rvm.key.codes.Backslash
KEY_CODE_MAP[221] = rvm.key.codes.CloseSquareBracket
KEY_CODE_MAP[222] = rvm.key.codes.Quote
KEY_CODE_MAP[223] = rvm.key.codes.Oem8

KEY_CODE_MAP[226] = rvm.key.codes.Oem102

/**
	 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/rvm.key.codes-spec.html
	 * If an Input Method Editor is processing key input and the event is keydown, return 229.
	 */
KEY_CODE_MAP[229] = rvm.key.codes.KeyInComposition

function extractKeyCode(e: KeyboardEvent): number {
	if (e.charCode) {
		// "keypress" events mostly
		let char = String.fromCharCode(e.charCode).toUpperCase()
		return rvm.key.codeFromString(char)
	}
	return KEY_CODE_MAP[e.keyCode] || rvm.key.codes.Unknown
}

const currWindow = electron.remote.getCurrentWindow()
console.log(currWindow)
let bounds = currWindow.getContentBounds()
currWindow.on('move', ({ sender }) => {
	bounds = sender.getContentBounds()
})

currWindow.on('resize', ({ sender }) => {
	bounds = sender.getContentBounds()
})

// https://github.com/sindresorhus/strip-bom/blob/master/index.js
const stripBOM = (x: any) => {
	if (typeof x !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof x)
	}

	// Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
	// conversion translates it to FEFF (UTF-16 BOM)
	if (x.charCodeAt(0) === 0xfeff) {
		return x.slice(1)
	}

	return x
}

declare function getCartPath(): string
declare const rvm: RosebudJS

const pkgInfo = require(path.resolve(getCartPath(), 'package.json'))
const mainFileName = path.resolve(getCartPath(), pkgInfo.main)
console.log(mainFileName)
const main = new mod(mainFileName, module)
main.filename = mainFileName
const content = `
${fs.readFileSync(mainFileName, 'utf8')}

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

main._compile(stripBOM(content), mainFileName)
const hooks: {
	_init: () => undefined
	_draw: (time: number) => undefined
	_update: (time: number) => undefined
} =
	main.exports
hooks._init()
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

console.log(rvm.key.codes)
const canvasRender = createRenderer(screen)
let paused = false
let lastTimestamp = performance.now()

const renderRVM = (time: number) => {
	const frames = Math.round(time / 16.66) || 1
	const average = time / frames
	for (let i = 0; i < frames; i++) {
		hooks._update(average)
	}
	hooks._draw(time)
}

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
			renderRVM(delta)
		}
		canvasRender(rvm)
	}
	rvm.saveInputFrame()
	stats.end()
	requestAnimationFrame(renderFrame)
}

requestAnimationFrame(renderFrame)
