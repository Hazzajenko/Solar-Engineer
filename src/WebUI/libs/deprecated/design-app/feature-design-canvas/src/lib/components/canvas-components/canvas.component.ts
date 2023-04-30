import { setupCanvas } from '../../functions/setup-canvas'
import {
	AfterViewInit,
	Component,
	ElementRef,
	inject,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core'

@Component({
	selector: 'app-canvas',
	template: `
		<canvas #canvas style="width: 100%; height: 100%;">
			<ng-content></ng-content>
		</canvas>
	`,
	standalone: true,
})
export class CanvasComponent implements OnInit, AfterViewInit {
	@ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>
	canvasEl!: HTMLCanvasElement
	height!: number
	width!: number
	ctx!: CanvasRenderingContext2D

	private _renderer = inject(Renderer2)

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}

	ngAfterViewInit() {
		this.canvasEl = this.canvasRef.nativeElement
		const { canvas, ctx } = setupCanvas(this.canvasEl)
		this.canvasEl = canvas
		this.ctx = ctx
		/*    this.canvasEl = this.canvasRef.nativeElement
     this.height = this.canvasEl.height
     this.width = this.canvasEl.width
     const ctx = this.canvasEl.getContext('2d')
     if (!ctx) throw new Error('No context')
     this.ctx = ctx

     this.ctx.setTransform(1, 0, 0, 1, 0, 0)

     this._renderer.setStyle(this.canvasEl, 'border', '1px solid black')
     this._renderer.setStyle(this.canvasEl, 'height', `${window.innerHeight}px}`)
     this._renderer.setStyle(this.canvasEl, 'width', `${window.innerWidth}px`)

     this.draw()*/
	}

	draw() {
		/*    this.ctx.fillStyle = 'red'
     this.ctx.fillRect(0, 0, this.width, this.height)*/
	}
}
