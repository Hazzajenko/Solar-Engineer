import { DesignCanvasDirective, DynamicContextMenuDirective, DynamicDialogDirective } from '../directives'
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, NgZone, OnInit, Renderer2, signal, ViewChild } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { LetDirective } from '@ngrx/component'
import { getGuid } from '@ngrx/data'
import { ActionsNotificationComponent, ButtonBuilderComponent, ShowSvgComponent, UndoActionNotificationComponent } from '@shared/ui'

import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ActionNotificationsDisplayComponent } from '@overlays/notifications/feature'
import { SideUiAuthViewComponent, SideUiNavBarComponent } from '@overlays/side-uis/feature'
import { MobileBottomToolbarComponent, OverlayToolBarComponent, SelectedStringToolBarComponent } from '@overlays/toolbars/feature'
import { AppStateStoreService, DivElementsService } from '@canvas/app/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { DraggableWindow, SCREEN_SIZE } from '@shared/data-access/models'
import { ContextMenuRendererComponent } from '@overlays/context-menus/feature'
import { ObjectPositioningStoreService } from '@canvas/object-positioning/data-access'
import { map } from 'rxjs'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { getScreenSize, selectSignalFromStore } from '@shared/utils'
import { selectSelectedStringId } from '@canvas/selected/data-access'
import { DialogRendererComponent } from '@overlays/dialogs/feature'
import { injectProjectsStore } from '@entities/data-access'
import { injectAuthStore } from '@auth/data-access'
// import { AngularFireAuth } from '@angular/fire/compat/auth'
// import { AngularFireAuth } from '@angular/fire/compat/auth'

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
		SelectedStringToolBarComponent,
		MobileBottomToolbarComponent,
		DialogRendererComponent,
		SideUiAuthViewComponent,
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
	// private _supabase = inject(SupabaseService)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// private _firebaseAuth = inject(AngularFireAuth)
	private _projectsStore = injectProjectsStore()
	private _authStore = injectAuthStore()
	private _ngZone = inject(NgZone)
	private _renderer = inject(Renderer2)
	private _divElements = inject(DivElementsService)
	private _elementRef = inject(ElementRef)
	private _element = inject(ElementRef).nativeElement
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _dialog = toSignal(this._uiStore.dialog$, { initialValue: this._uiStore.dialog })
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
	// firebaseUseasdasdasr = this._firebaseAuth.user
	user = this._authStore.select.user

	isProjectReadyToRender = this._projectsStore.select.projectReadyToRender
	// session = this._supabase.session
	screenSize = getScreenSize()
	// @ViewChildren('canvas') canvas: ElementRef<HTMLDivElement>
	version = signal('1.0.1')
	// version = '0.0.1'
	showFpsState = toSignal(this._graphicsStore.state$.pipe(map((state) => state.showFps)), {
		initialValue: this._graphicsStore.state.showFps,
	})
	stringIsSelected = selectSignalFromStore(selectSelectedStringId)
	// stringIsSelected2 = selectSignalFromKnownStoreV2<SelectedState>(state => state.selectedStringId)
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
	protected readonly SCREEN_SIZE = SCREEN_SIZE

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
		/*		setTimeout(() => {
		 this._uiStore.dispatch.openDialog({
		 component: 'SignInDialogComponent',
		 })
		 }, 1000)*/
		/*		this._uiStore.dispatch.openDialog({
		 component: 'SignInDialogComponent',
		 })*/
		// this._supabase.authChanges((_, session) => (this.session = session))
	}

	ngAfterViewInit() {
		// console.log(this.constructor.name, 'ngAfterViewInit')
		if (this.appStats) {
			// console.log(this.appStats.nativeElement)
			const children = this.appStats.nativeElement.children
			// console.log(children)
			for (let i = 0; i < children.length; i++) {
				// console.log(children[i])
				this._divElements.addElement(children[i] as HTMLDivElement)
			}
		}
	}

	waitForElements() {
		this._renderer.listen(document, 'DOMContentLoaded', () => {
			this._divElements.initElements()
		})
	}
}
