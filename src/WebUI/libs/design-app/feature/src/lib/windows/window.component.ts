import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { NgIf } from '@angular/common'
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { RenderService } from '@design-app/data-access'
import { DraggableWindow } from '@design-app/shared'
import { EVENT_TYPE } from '@shared/data-access/models'
import { ShowSvgComponent, ShowSvgV2Component } from '@shared/ui'


@Component({
	selector: 'app-window[draggableWindow]',
	standalone: true,
	templateUrl: 'window.component.html',
	imports: [ShowSvgComponent, CdkDrag, CdkDragHandle, NgIf, ShowSvgV2Component],
})
export class WindowComponent implements AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _render = inject(RenderService)
	private _elementRef = inject(ElementRef)
	@ViewChild('windowBar', { static: true }) windowBar!: ElementRef<HTMLDivElement>
	isOpen = true

	// @Input() location!: Point
	@Input() draggableWindow!: DraggableWindow
	@Output() minimiseEvent = new EventEmitter<boolean>()

	ngAfterViewInit(): void {
		this._ngZone.runOutsideAngular(() => {
			console.log('ngAfterViewInit', this.windowBar.nativeElement)
			this._renderer.listen(this.windowBar.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}

	openWindow() {
		this.isOpen = true
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'block')
	}

	closeWindow() {
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none')
	}

	minimiseWindow() {
		this.minimiseEvent.emit(true)
		this.isOpen = false
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none')
	}
}