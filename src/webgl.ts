import { flatten } from 'ramda'
import { uw } from './utils'
import { RosebudJS } from 'rose-vm'

// var w = require('electron').remote.getCurrentWindow()

// w.setAspectRatio(rvm.screenWidth / rvm.screenHeight, { width: 0, height: 0 })
// w.setSize(rvm.screenWidth * 3, rvm.screenHeight * 3 + window.outerHeight - window.innerHeight)

const fShaderSrc = `
precision mediump float;
precision mediump int;

uniform sampler2D u_palette;     //256 x 1 pixels
uniform sampler2D u_screen;
varying vec2 v_texCoord;

void main()
{
  //What color do we want to index?
  vec4 index = texture2D(u_screen, v_texCoord);
  //Do a dependency texture read
  vec4 texel = texture2D(u_palette, index.xy);
  gl_FragColor = texel;   //Output the color
}
`

const vShaderSrc = `
precision mediump float;
precision mediump int;

attribute vec2 a_position;
attribute vec2 a_texCoord;

varying vec2 v_texCoord;
void main() {
  v_texCoord = a_texCoord;
  gl_Position = vec4(a_position,0, 1);
}`

const numVertices = 6

function getShader(gl: WebGL2RenderingContext, str: string, type: number) {
	var shader = gl.createShader(type)

	gl.shaderSource(shader, str)
	gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader))
		return null
	}

	return shader
}

function createTexture(gl: WebGL2RenderingContext) {
	var texture = uw(gl.createTexture())
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	return texture
}

function updateTextures(gl: WebGL2RenderingContext, screenTex: WebGLTexture, paletteTex: WebGLTexture, rvm: RosebudJS) {
	gl.bindTexture(gl.TEXTURE_2D, screenTex)
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.LUMINANCE,
		rvm.screenWidth,
		rvm.screenHeight,
		0,
		gl.LUMINANCE,
		gl.UNSIGNED_BYTE,
		rvm.screen
	)
	gl.bindTexture(gl.TEXTURE_2D, paletteTex)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 256, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, rvm.palette)
}

export default function createRenderer(canvas: HTMLCanvasElement) {
	let gl = uw<WebGL2RenderingContext>(canvas.getContext('webgl2'))
	// function initShaders() {
	let fragmentShader = getShader(gl, fShaderSrc, gl.FRAGMENT_SHADER)
	let vertexShader = getShader(gl, vShaderSrc, gl.VERTEX_SHADER)

	const program = uw(gl.createProgram())
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error('Could not initialise shaders')
	}

	gl.useProgram(program)

	const shaders = {
		program,
		vertexPositionAttribute: gl.getAttribLocation(program, 'a_position'),
		textureCoordsAttribute: gl.getAttribLocation(program, 'a_texCoord'),
		paletteUniform: gl.getUniformLocation(program, 'u_palette'),
		screenUniform: gl.getUniformLocation(program, 'u_screen'),
	}

	gl.enableVertexAttribArray(shaders.vertexPositionAttribute)
	gl.enableVertexAttribArray(shaders.textureCoordsAttribute)

	const screenTex = createTexture(gl)
	const paletteTex = createTexture(gl)

	const vertexPositionBuffer = uw(gl.createBuffer())
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(
			flatten<number>([[-1.0, -1.0], [1.0, -1.0], [-1.0, 1.0], [-1.0, 1.0], [1.0, -1.0], [1.0, 1.0]])
		),
		gl.STATIC_DRAW
	)
	const vertexPositionBufferItemSize = 2

	const texCoordsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer)
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(flatten<number>([[0.0, 1.0], [1.0, 1.0], [0.0, 0.0], [0.0, 0.0], [1.0, 1.0], [1.0, 0.0]])),
		gl.STATIC_DRAW
	)
	const texCoordsBufferItemSize = 2

	gl.clearColor(0.0, 0.0, 0.0, 1.0)
	gl.enable(gl.DEPTH_TEST)

	return function drawScene(rvm: RosebudJS) {
		gl.viewport(0, 0, rvm.screenWidth, rvm.screenHeight)
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
		updateTextures(gl, screenTex, paletteTex, rvm)

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer)
		gl.vertexAttribPointer(shaders.vertexPositionAttribute, vertexPositionBufferItemSize, gl.FLOAT, false, 0, 0)

		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordsBuffer)
		gl.vertexAttribPointer(shaders.textureCoordsAttribute, texCoordsBufferItemSize, gl.FLOAT, false, 0, 0)

		gl.activeTexture(gl.TEXTURE0)

		gl.bindTexture(gl.TEXTURE_2D, screenTex)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		gl.uniform1i(shaders.screenUniform, 0)

		gl.activeTexture(gl.TEXTURE1)

		gl.bindTexture(gl.TEXTURE_2D, paletteTex)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

		gl.uniform1i(shaders.paletteUniform, 1)

		gl.drawArrays(gl.TRIANGLES, 0, numVertices)
	}
}
