import {
	CanvasClientStateService,
	CanvasRenderService,
	ContextMenuType,
	DomPointService,
	MachineService,
	ObjectRotatingService,
} from '../../../../services'
import { GetEntityByIdPipe } from './get-entity.pipe'
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	NgZone,
	Output,
	Renderer2,
} from '@angular/core'
import { EVENT_TYPE, UndefinedString } from '@shared/data-access/models'
import { ShowSvgComponent } from '@shared/ui'
import { tap } from 'rxjs'

@Component({
	selector: 'app-right-click-menu-v2',
	standalone: true,
	imports: [ShowSvgComponent, NgIf, AsyncPipe, JsonPipe, GetEntityByIdPipe],
	templateUrl: './right-click-menu-v2.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightClickMenuV2Component implements AfterViewInit {
	private _ngZone = inject(NgZone)
	private _domPoint = inject(DomPointService)
	private _objRotating = inject(ObjectRotatingService)
	private _state = inject(CanvasClientStateService)
	private _machine = inject(MachineService)
	private _renderer = inject(Renderer2)
	private _render = inject(CanvasRenderService)
	private _elementRef = inject(ElementRef)
	id!: string
	type!: ContextMenuType
	contextMenu$ = this._machine.subscribeContextMenu().pipe(
		tap((contextMenu) => {
			if (!contextMenu) return
			this.id = contextMenu.id
			this.type = contextMenu.type
			this.initMenu(contextMenu)
		}),
	)
	@Output() closeMenu = new EventEmitter()

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(
				this._elementRef.nativeElement,
				EVENT_TYPE.POINTER_ENTER,
				(event: PointerEvent) => {
					console.log(EVENT_TYPE.POINTER_ENTER, event)
					this._render.drawCanvas()
				},
			)
		})
	}

	initMenu(contextMenu: { x: number; y: number }) {
		this._renderer.setStyle(this._elementRef.nativeElement, 'left', `${contextMenu.x}px`)
		this._renderer.setStyle(this._elementRef.nativeElement, 'top', `${contextMenu.y}px`)
		this._renderer.setStyle(this._elementRef.nativeElement, 'position', 'absolute')
	}

	rotate(event: MouseEvent) {
		const startPoint = this._domPoint.getTransformedPointFromEventOffsets(event)

		this._objRotating.setEntityToRotate(this.id, startPoint)
		this._render.drawCanvas()
		this._machine.sendEvent({ type: 'CloseContextMenu' })
	}

	delete() {
		this._state.entities.panels.removeEntity(this.id)
		this._render.drawCanvas()
		this._machine.sendEvent({ type: 'CloseContextMenu' })
	}

	// protected readonly UndefinedStringId = UndefinedStringId
	// protected readonly UndefinedString = UndefinedString
	// protected readonly UndefinedString = UndefinedString
	protected readonly UndefinedString = UndefinedString
}
