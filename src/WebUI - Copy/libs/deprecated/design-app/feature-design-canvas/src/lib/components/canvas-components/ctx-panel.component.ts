import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { CANVAS_COLORS, CanvasEntity } from 'deprecated/design-app/feature-design-canvas'

@Component({
	selector: 'app-ctx-panel[ctx][panel]',
	template: ` <ng-content></ng-content> `,
	standalone: true,
})
export class CtxPanelComponent implements OnInit, AfterViewInit {
	/*  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>
   canvasEl!: HTMLCanvasElement
   height!: number
   width!: number
   ctx!: CanvasRenderingContext2D*/

	@Input() ctx!: CanvasRenderingContext2D
	@Input() panel!: CanvasEntity

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
		console.log(this.ctx)
		/* this.draw()*/
	}

	ngAfterViewInit() {
		console.log(this.constructor.name, 'ngAfterViewInit')
		/*    this.canvasEl = this.canvasRef.nativeElement
     this.height = this.canvasEl.height
     this.width = this.canvasEl.width
     const ctx = this.canvasEl.getContext('2d')
     if (!ctx) throw new Error('No context')
     this.ctx = ctx*/
		// this.draw()
		// this.ctx.fillStyle = 'red'

		// this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
	}

	draw() {
		const { location, width, height, angle } = this.panel
		this.ctx.save()
		this.ctx.fillStyle = CANVAS_COLORS.DefaultPanelFillStyle
		this.ctx.translate(location.x + width / 2, location.y + height / 2)
		this.ctx.rotate(angle)
		this.ctx.beginPath()
		this.ctx.rect(-width / 2, -height / 2, width, height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	/*  animate60Fps() {
   const fps = 60
   const interval = 1000 / fps
   let then = Date.now()
   let now = then
   const delta = now - then
   const step = () => {
   requestAnimationFrame(step)
   now = Date.now()
   const delta = now - then
   if (delta > interval) {
   then = now - (delta % interval)
   this.draw()
   }
   }
   requestAnimationFrame(step)
   }*/

	drawWithCtx(ctx: CanvasRenderingContext2D) {
		const { location, width, height, angle } = this.panel
		ctx.save()
		ctx.fillStyle = CANVAS_COLORS.DefaultPanelFillStyle
		ctx.translate(location.x + width / 2, location.y + height / 2)
		ctx.rotate(angle)
		ctx.beginPath()
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
	}
}
