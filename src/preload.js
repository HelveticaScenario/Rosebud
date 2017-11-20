process.once('loaded', () => {
	const mod = require('module')
	const path = require('path')
	console.log(document)
    let rvm = require('rose-vm')()
    global.screen = rvm.screen
    global.palette = rvm.palette
    global.paletteMap = rvm.paletteMap
    global.memory = rvm.memory
    global.screenWidth = rvm.screenWidth
    global.screenHeight = rvm.screenHeight
	global.pset = rvm.pset.bind(rvm)
	global.pget = rvm.pget.bind(rvm)
	global.palset = rvm.palset.bind(rvm)
	global.palget = rvm.palget.bind(rvm)
	global.line = rvm.line.bind(rvm)
	global.rect = rvm.rect.bind(rvm)
	global.rectfill = rvm.rectfill.bind(rvm)
	global.circ = rvm.circ.bind(rvm)
	global.circfill = rvm.circfill.bind(rvm)
	global.tri = rvm.tri.bind(rvm)
	global.trifill = rvm.trifill.bind(rvm)
	global.cls = rvm.cls.bind(rvm)
	global.print = rvm.print.bind(rvm)
	global.color = rvm.color.bind(rvm)
	global.mouse = rvm.mouse.bind(rvm)
	global.btn = rvm.btn.bind(rvm)
	global.btnp = rvm.btnp.bind(rvm)
	global.wheel = rvm.wheel.bind(rvm)
	global.key = rvm.key.bind(rvm)
	global.key.codes = rvm.key.codes
	global.key.codeFromString = rvm.key.codeFromString
	global.key.codeToString = rvm.key.codeToString
	global.keyp = rvm.keyp.bind(rvm)
	global.keyp.codes = rvm.keyp.codes
	global.keyp.codeFromString = rvm.keyp.codeFromString
	global.keyp.codeToString = rvm.keyp.codeToString
	global.poke = rvm.poke.bind(rvm)
	global.peek = rvm.peek.bind(rvm)
	global.memcpy = rvm.memcpy.bind(rvm)
	global.memset = rvm.memset.bind(rvm)
	global.mod = mod
	// const oldWrap = mod.wrap
	global.getCartPath = () => path.resolve(__dirname, '../testCart')
	global.rvm = rvm
	// global.reload = () => {

	// 	return Object.assign({}, require(path.resolve(__dirname, '../testCart')), { rvm })
	// }
})
