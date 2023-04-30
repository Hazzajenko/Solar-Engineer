import { GetPanelWithStringPipe } from './get-panel-with-string.pipe'
import { GetSelectedPanelsPipe } from './get-selected-panels.pipe'
import { GetStringWithPanelIdsPipe } from './get-string.pipe'
import {
	AsyncPipe,
	JsonPipe,
	NgIf,
	NgSwitch,
	NgSwitchCase,
	NgSwitchDefault,
	NgTemplateOutlet,
} from '@angular/common'
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
import {
	AppStoreService,
	ContextMenuType,
	DomPointService,
	EntityStoreService,
	ObjectRotatingService,
	RenderService,
} from '@design-app/data-access'
import { EVENT_TYPE } from '@shared/data-access/models'
import { ShowSvgComponent } from '@shared/ui'
import { tap } from 'rxjs'


@Component({
	selector: 'app-right-click-menu',
	standalone: true,
	imports: [
		ShowSvgComponent,
		NgIf,
		AsyncPipe,
		JsonPipe,
		NgSwitch,
		NgSwitchCase,
		NgSwitchDefault,
		NgTemplateOutlet,
		GetPanelWithStringPipe,
		GetStringWithPanelIdsPipe,
		GetSelectedPanelsPipe,
	],
	templateUrl: './right-click-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightClickMenuComponent implements AfterViewInit {
	private _ngZone = inject(NgZone)
	private _domPoint = inject(DomPointService)
	private _objRotating = inject(ObjectRotatingService)
	private _entities = inject(EntityStoreService)
	private _app = inject(AppStoreService)
	private _renderer = inject(Renderer2)
	private _render = inject(RenderService)
	private _elementRef = inject(ElementRef)
	id!: string
	type!: ContextMenuType
	contextMenu$ = this._app.subscribeContextMenu$().pipe(
		tap((contextMenu) => {
			if (!contextMenu) return
			// this.id = contextMenu.id
			// this.type = contextMenu.type
			this.initMenu(contextMenu)
		}),
	)
	@Output() closeMenu = new EventEmitter()

	ngAfterViewInit() {
		this._ngZone.runOutsideAngular(() => {
			this._renderer.listen(this._elementRef.nativeElement, EVENT_TYPE.POINTER_ENTER, () => {
				this._render.renderCanvasApp()
			})
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
		this._render.renderCanvasApp()
		this._app.sendEvent({ type: 'CloseContextMenu' })
	}

	delete() {
		this._entities.panels.removeEntity(this.id)
		this._render.renderCanvasApp()
		this._app.sendEvent({ type: 'CloseContextMenu' })
	}
}