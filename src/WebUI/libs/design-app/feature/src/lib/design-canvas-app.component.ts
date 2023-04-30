import { DesignCanvasDirective } from './design-canvas.directive'
import {
	CanvasGraphicsMenuComponent,
	KeyMapComponent,
	RightClickMenuComponent,
	StateValuesComponent,
} from './menus'
import { StringWindowComponent } from './windows'
import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	NgZone,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { LetModule } from '@ngrx/component'
import { EVENT_TYPE } from '@shared/data-access/models'
import { ShowSvgComponent, WindowComponent } from '@shared/ui'


@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetModule,
		KeyMapComponent,
		CanvasGraphicsMenuComponent,
		StateValuesComponent,
		RightClickMenuComponent,
		DesignCanvasDirective,
		WindowComponent,
		StringWindowComponent,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit, AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _elementRef = inject(ElementRef)
	@ViewChild('stringWindow', { static: true }) stringWindow!: StringWindowComponent
	isDragging = false

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}

	ngAfterViewInit(): void {
		console.log(this.constructor.name, 'ngAfterViewInit')
		console.log(this.stringWindow, 'stringWindow')

		this._ngZone.runOutsideAngular(() => {
			console.log('ngAfterViewInit', this.stringWindow.windowBar.nativeElement)
			this._renderer.listen(
				this.stringWindow.windowBar.nativeElement,
				EVENT_TYPE.POINTER_DOWN,
				(event: PointerEvent) => {
					console.log('dragging', event)
					this.isDragging = true
					// if (this.isDragging) {
					console.log('dragging', event)
					this._renderer.setStyle(this.stringWindow.windowBar.nativeElement, 'top', `0px`)
					this._renderer.setStyle(this.stringWindow.windowBar.nativeElement, 'left', `0px`)
					// }
				},
			)
			this._renderer.listen(
				this.stringWindow.windowBar.nativeElement,
				EVENT_TYPE.POINTER_UP,
				(event: PointerEvent) => {
					console.log('dragging', event)
					this.isDragging = false
				},
			)

			this._renderer.listen(
				this.stringWindow.windowBar.nativeElement,
				EVENT_TYPE.POINTER_MOVE,
				(event: PointerEvent) => {
					/*			if (this.isDragging) {
				 console.log('dragging', event)
				 this._renderer.setStyle(this._elementRef.nativeElement, 'top', `${event.clientY}px`)
				 this._renderer.setStyle(this._elementRef.nativeElement, 'left', `${event.clientX}px`)
				 }*/
				},
			)
			/*const svg = this._elementRef.nativeElement.querySelector('svg')
			 this._renderer.setStyle(svg, 'background-color', 'red')*/
		})
	}

	// protected readonly state = state
}