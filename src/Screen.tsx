import * as React from 'react'
// import * as rosevm from 'rose-vm'
import createRenderer from './webgl'
import { RosebudJS } from 'rose-vm'

export interface ScreenProps {
	rvm: RosebudJS
	renderCB: (time: number) => void
	paused: boolean
}
export default class Screen extends React.Component<ScreenProps, {}> {
	canvas: HTMLCanvasElement | undefined
	canvasRender: ((rvm: RosebudJS) => void) | undefined
	animationID: number | undefined
	lastTimestamp: number

	componentDidMount() {
		this.lastTimestamp = performance.now()
		this.animationID = requestAnimationFrame(this.renderFrame)
	}

	renderFrame = (time: number) => {
		this.animationID = requestAnimationFrame(this.renderFrame)
		const delta = time - this.lastTimestamp
		this.lastTimestamp = time
		if (this.canvas && this.canvasRender) {
			if (!this.props.paused) {
				this.props.renderCB(delta)
			}
			this.canvasRender(this.props.rvm)
		}
	}

	componentWillUnmount() {
		if (this.animationID != null) {
			cancelAnimationFrame(this.animationID)
			this.animationID = undefined
		}
	}

	canvasRefCB = (el: HTMLCanvasElement | null) => {
		if (el && el !== this.canvas) {
			this.canvas = el
			this.canvasRender = createRenderer(this.canvas)
		} else if (!el) {
			this.canvas = undefined
			this.canvasRender = undefined
		}
		console.log(this)
	}
	render() {
		const { screenWidth, screenHeight } = this.props.rvm
		return <canvas width={screenWidth} height={screenHeight} ref={this.canvasRefCB} />
	}
}
