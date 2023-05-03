import { WINDOW_RESIZER, WindowResizerDirective } from './window-resizer.directive'
import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop'
import { AsyncPipe, NgIf } from '@angular/common'
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
import { RenderService, WindowsStore } from '@design-app/data-access'
import { DraggableWindow } from '@design-app/shared'
import { updateObjectByIdForStore } from '@design-app/utils'
import { EVENT_TYPE, Point } from '@shared/data-access/models'
import { ShowSvgComponent, ShowSvgV2Component } from '@shared/ui'
import { updateObjectForStore } from 'deprecated/design-app/feature-design-canvas'
import { map, Observable } from 'rxjs'


@Component({
	selector: 'app-window[windowId]',
	standalone: true,
	templateUrl: 'window.component.html',
	imports: [
		ShowSvgComponent,
		CdkDrag,
		CdkDragHandle,
		NgIf,
		ShowSvgV2Component,
		AsyncPipe,
		WindowResizerDirective,
	],
})
export class WindowComponent implements AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _render = inject(RenderService)
	private _windows = inject(WindowsStore)
	private _elementRef = inject(ElementRef)

	protected readonly WINDOW_RESIZER = WINDOW_RESIZER
	@ViewChild('windowBar', { static: true }) windowBar!: ElementRef<HTMLDivElement>
	isOpen = true

	window$!: Observable<DraggableWindow | undefined>
	location!: Point

	// @Input() location!: Point
	// @Input() draggableWindow!: DraggableWindow

	@Input() set windowId(windowId: string) {
		this.window$ = this._windows.select.windowById$(windowId).pipe(
			map((window) => {
				if (!window) return
				this.location = window.location
				return window
			}),
		)
	}

	@Output() minimiseEvent = new EventEmitter<boolean>()

	ngAfterViewInit(): void {
		this._ngZone.runOutsideAngular(() => {
			// console.log('ngAfterViewInit', this.windowBar.nativeElement)
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
		})
	}

	dragExited(event: CdkDragEnd, draggableWindow: DraggableWindow) {
		console.log('dragExited', event)
		const location = {
			x: event.source.getFreeDragPosition().x,
			y: event.source.getFreeDragPosition().y,
		}
		const update = updateObjectByIdForStore(draggableWindow.id, { location })
		// const update = updateObjectByIdForStore(draggableWindow.id, { location: this.location })
		this._windows.dispatch.updateWindow(update)
	}

	openWindow() {
		this.isOpen = true
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'block')
	}

	closeWindow() {
		this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none')
		this._windows.dispatch.deleteWindow(this.windowId)
	}

	minimiseWindow(draggableWindow: DraggableWindow) {
		this.minimiseEvent.emit(true)
		this.isOpen = false
		// this._renderer.setStyle(this._elementRef.nativeElement, 'display', 'none')
		const update = updateObjectForStore(draggableWindow, { isOpen: false })
		this._windows.dispatch.updateWindow(update)
	}
}