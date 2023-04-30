import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { NgIf } from '@angular/common'
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	NgZone,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { RenderService } from '@design-app/data-access'
import { EVENT_TYPE } from '@shared/data-access/models'
import { ShowSvgComponent, ShowSvgV2Component } from '@shared/ui'


@Component({
	selector: 'app-string-window-component',
	standalone: true,
	templateUrl: 'string-window.component.html',
	imports: [ShowSvgComponent, CdkDrag, CdkDragHandle, NgIf, ShowSvgV2Component],
})
export class StringWindowComponent implements AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _render = inject(RenderService)
	private _elementRef = inject(ElementRef)
	@ViewChild('windowBar', { static: true }) windowBar!: ElementRef<HTMLDivElement>
	isDragging = false
	isOpen = true

	@Output() windowTitle = 'String Window'
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