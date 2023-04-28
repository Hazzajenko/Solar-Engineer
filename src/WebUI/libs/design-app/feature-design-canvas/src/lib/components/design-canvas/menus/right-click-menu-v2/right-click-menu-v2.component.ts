import {
	CanvasClientStateService,
	CanvasRenderService,
	DomPointService,
	MachineService,
	ObjectRotatingService,
} from '../../../../services'
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Output,
	Renderer2,
} from '@angular/core'
import { EntityType } from '@design-app/shared'
import { ShowSvgComponent } from '@shared/ui'
import { tap } from 'rxjs'


@Component({
	selector: 'app-right-click-menu-v2',
	standalone: true,
	imports: [ShowSvgComponent, NgIf, AsyncPipe, JsonPipe],
	templateUrl: './right-click-menu-v2.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightClickMenuV2Component {
	private _domPoint = inject(DomPointService)
	private _objRotating = inject(ObjectRotatingService)
	private _state = inject(CanvasClientStateService)
	private _machine = inject(MachineService)
	private _renderer = inject(Renderer2)
	private _render = inject(CanvasRenderService)
	private _elementRef = inject(ElementRef)
	id!: string
	type!: EntityType
	contextMenu$ = this._machine.subscribeContextMenu().pipe(
		tap((contextMenu) => {
			if (!contextMenu) return
			this.id = contextMenu.id
			this.type = contextMenu.type
			this.initMenu(contextMenu)
		}),
	)
	@Output() closeMenu = new EventEmitter()

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
		this._state.entities.canvasEntities.removeEntity(this.id)
		this._render.drawCanvas()
		this._machine.sendEvent({ type: 'CloseContextMenu' })
	}
}