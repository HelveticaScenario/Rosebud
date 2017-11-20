import * as React from 'react'
import * as rosevm from 'rose-vm'
// import { VM } from 'vm2'
import * as VM from 'vm'
import Screen from './Screen'
import * as path from 'path'
import * as fs from 'fs'


const cartPath = path.resolve(__dirname, '../testCart/')
const PACKAGE_JSON = 'package.json'
const INDEX_JS = 'index.js'
const wrap = (code: string) => `
(exports) => {
	${code}
	
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
}
`

export class App extends React.Component<{}, { rvm: rosevm.RosebudJS; paused: boolean }> {
	hooks: {
		_init: () => void
		_update: (time: number) => void
		_draw: (time: number) => void
	}

	constructor(props: {}) {
		super(props)
		const rvm = rosevm()

		const sandbox = VM.createContext({
			pset: rvm.pset.bind(rvm),
			pget: rvm.pget.bind(rvm),
			palset: rvm.palset.bind(rvm),
			palget: rvm.palget.bind(rvm),
			line: rvm.line.bind(rvm),
			rect: rvm.rect.bind(rvm),
			rectfill: rvm.rectfill.bind(rvm),
			circ: rvm.circ.bind(rvm),
			circfill: rvm.circfill.bind(rvm),
			tri: rvm.tri.bind(rvm),
			trifill: rvm.trifill.bind(rvm),
			cls: rvm.cls.bind(rvm),
			print: rvm.print.bind(rvm),
			color: rvm.color.bind(rvm),
			mouse: rvm.mouse.bind(rvm),
			btn: rvm.btn.bind(rvm),
			btnp: rvm.btnp.bind(rvm),
			wheel: rvm.wheel.bind(rvm),
			key: rvm.key.bind(rvm),
			keyp: rvm.keyp.bind(rvm),
			poke: rvm.poke.bind(rvm),
			peek: rvm.peek.bind(rvm),
			memcpy: rvm.memcpy.bind(rvm),
			memset: rvm.memset.bind(rvm),
		})

		let main: string
		let pkg = fs.readdirSync(cartPath)
		if (pkg.indexOf(PACKAGE_JSON) != -1) {
			const pkgJson = JSON.parse(fs.readFileSync(path.resolve(cartPath, PACKAGE_JSON), 'utf8'))
			main = path.resolve(cartPath, pkgJson.main)
		} else {
			main = path.resolve(cartPath, INDEX_JS)
		}
	
		const code = new VM.Script(wrap(fs.readFileSync(main, 'utf8')))
		// const vm = ({
		// 	sandbox,
		// })

		this.hooks = {
			_draw: _ => undefined,
			_update: _ => undefined,
			_init: () => undefined,
		}
		const exp = {}
		// code.runInContext(sandbox)(exp)
		// const a = 
		// console.log('asdas',a)
		this.hooks = Object.assign({}, this.hooks, require(main))
		console.log(exp, this.hooks)
		this.hooks._init()

		// let v = 0;
		// function _draw(time: number) {
		// 	if (v % 50 === 0) {
		// 		console.log(time)
		// 	}
		// 	for(let x = 0; x < 320; x++) {
		// 		for (let y = 0; y < 180; y++) {
		// 			sandbox.pset(x,y,(x+y+v)%15);
		// 		}
		// 	}
		// 	// print(t);
		// 	// rectfill(0,0,320,180,r[t]);
		// 	// pset(0,0,t);
		// 	++v;
		// }
		// this.hooks._draw = _draw

		this.state = {
			rvm,
			paused: false,
		}
	}
	renderRVM = (time: number) => {
		const frames = Math.round(time / 16.66) || 1
		const average = time / frames
		for (let i = 0; i < frames; i++) {
			this.hooks._update(average)
		}
		this.hooks._draw(time)
	}

	render() {
		return <Screen rvm={this.state.rvm} renderCB={this.renderRVM} paused={this.state.paused} />
	}
}
