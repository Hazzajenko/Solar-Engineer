import {
	DesignCanvasDirective,
	DynamicContextMenuDirective,
	DynamicDialogDirective,
} from '../directives'
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	computed,
	ElementRef,
	inject,
	NgZone,
	OnInit,
	Renderer2,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { LetDirective } from '@ngrx/component'
import { getGuid } from '@ngrx/data'
import {
	ActionsNotificationComponent,
	ButtonBuilderComponent,
	ShowSvgComponent,
	UndoActionNotificationComponent,
} from '@shared/ui'

import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ActionNotificationsDisplayComponent } from '@overlays/notifications/feature'
import { SideUiNavBarComponent } from '@overlays/side-uis/feature'
import { OverlayToolBarComponent } from '@overlays/toolbars/feature'
import { AppStateStoreService, DivElementsService } from '@canvas/app/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { DraggableWindow } from '@shared/data-access/models'
import { ContextMenuRendererComponent } from '@overlays/context-menus/feature'
import { ObjectPositioningStoreService } from '@canvas/object-positioning/data-access'
import { map } from 'rxjs'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CdkDrag,
		CommonModule,
		ShowSvgComponent,
		LetDirective,
		DesignCanvasDirective,
		ButtonBuilderComponent,
		DesignCanvasDirective,
		DynamicDialogDirective,
		DynamicContextMenuDirective,
		ActionsNotificationComponent,
		UndoActionNotificationComponent,
		ActionNotificationsDisplayComponent,
		SideUiNavBarComponent,
		OverlayToolBarComponent,
		ContextMenuRendererComponent,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [
		`
			/*			canvas:active {
							cursor: grabbing !important;
						}*/
		`,
	],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit, AfterViewInit {
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _divElements = inject(DivElementsService)
	private _elementRef = inject(ElementRef)
	private _element = inject(ElementRef).nativeElement
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	private _dialog = toSignal(this._uiStore.dialog$, { initialValue: this._uiStore.dialog })
	// @ViewChildren('canvas') canvas: ElementRef<HTMLDivElement>
	private _contextMenu = toSignal(this._uiStore.contextMenu$, {
		initialValue: this._uiStore.contextMenu,
	})
	private _objectPositioningStore = inject(ObjectPositioningStoreService)
	private _toMoveState$ = this._objectPositioningStore.state$.pipe(
		map((state) => state.moveEntityState),
	)
	private _toMoveState = toSignal(this._toMoveState$, {
		initialValue: this._objectPositioningStore.state.moveEntityState,
	})
	private _objectPositioningState$ = this._objectPositioningStore.state$.pipe(
		map((state) => ({
			moveEntityState: state.moveEntityState,
			toMoveSpotTaken: state.toMoveSpotTaken,
			rotateEntityState: state.rotateEntityState,
		})),
	)
	private _objectPositioningState = toSignal(this._objectPositioningState$, {
		initialValue: {
			moveEntityState: this._objectPositioningStore.state.moveEntityState,
			toMoveSpotTaken: this._objectPositioningStore.state.toMoveSpotTaken,
			rotateEntityState: this._objectPositioningStore.state.rotateEntityState,
		},
	})
	@ViewChild('appStats', { static: true }) appStats!: ElementRef<HTMLDivElement>
	cursorState = computed(() => {
		const { moveEntityState, toMoveSpotTaken, rotateEntityState } = this._objectPositioningState()
		if (moveEntityState === 'MovingSingleEntity' || moveEntityState === 'MovingMultipleEntities') {
			if (toMoveSpotTaken) {
				return 'not-allowed'
			}

			return 'grabbing'
		}

		if (
			rotateEntityState === 'RotatingSingleEntity' ||
			rotateEntityState === 'RotatingMultipleEntities'
		) {
			return 'ns-resize'
		}

		const viewPositioningState = this._appStore.state.view

		if (viewPositioningState === 'ViewDraggingInProgress') {
			return 'move'
		}

		return ''
	})
	windows: DraggableWindow[] = [
		{
			id: getGuid(),
			title: 'Window 1',
			location: { x: 100, y: 100 },
			size: { width: 200, height: 200 },
			isOpen: true,
		},
	]

	constructor() {
		this.waitForElements()
	}

	get dialog() {
		return this._dialog()
	}

	get contextMenu() {
		return this._contextMenu()
	}

	ngOnInit() {
		console.log(this.constructor.name, 'ngOnInit')
	}

	ngAfterViewInit() {
		console.log(this.constructor.name, 'ngAfterViewInit')
		if (this.appStats) {
			console.log(this.appStats.nativeElement)
			const children = this.appStats.nativeElement.children
			console.log(children)
			for (let i = 0; i < children.length; i++) {
				console.log(children[i])
				this._divElements.addElement(children[i] as HTMLDivElement)
			}
		}
	}

	waitForElements() {
		this._renderer.listen(document, 'DOMContentLoaded', () => {
			this._divElements.initElements()
		})
	}

	/*	pushWindow(event: MouseEvent) {
	 this._windows.dispatch.addWindow({
	 id: getGuid(),
	 title: 'Window 2',
	 location: { x: event.clientX, y: event.clientY },
	 size: { width: 200, height: 200 },
	 isOpen: true,
	 })
	 /!*		this.windows.push({
	 id: 'window2',
	 title: 'Window 2',
	 location: { x: event.clientX, y: event.clientY },
	 size: { width: 200, height: 200 },
	 isOpen: true,
	 })*!/
	 }

	 openWindow(window: DraggableWindow) {
	 // const update = updateObjectForStore(window, { isOpen: true })
	 // this._windows.dispatch.updateWindow(update)
	 }

	 closeWindow(window: DraggableWindow) {
	 this._windows.dispatch.deleteWindow(window.id)
	 }*/
}
