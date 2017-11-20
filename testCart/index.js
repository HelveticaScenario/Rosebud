require('./src/main')
let v = 0

function _update() {
	++v
}
let oldX = null
let oldY = null
function _draw(time) {
	// cls()
	// print('\n\n\n\n\n')
	// print(btn(0)+ '\n')
	// print(btnp(0)+'\n\n')
	// print(key(key.codes.KeyQ)+'\n')
	// print(keyp(key.codes.KeyQ)+'\n\n')
	// print(mouse())
	let [x, y] = mouse()
	if (oldX == null) {
		oldX = x
	}
	if (oldY == null) {
		oldY = y
	}
	if (btn(0)) {
		line(x, y, oldX, oldY, key(key.codes.KeyQ) ? 5 : 9)
	}
	oldX = x
	oldY = y
}

exports._update = _update
exports._draw = _draw
exports._init = _ => _
