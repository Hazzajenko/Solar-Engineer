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
	OnInit,
	Renderer2,
	signal,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { LetDirective } from '@ngrx/component'
import {
	ActionsNotificationComponent,
	ButtonBuilderComponent,
	ShowSvgComponent,
	UndoActionNotificationComponent,
} from '@shared/ui'

import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { ActionNotificationsDisplayComponent } from '@overlays/notifications/feature'
import { SideUiAuthViewComponent, SideUiNavBarComponent } from '@overlays/side-uis/feature'
import {
	MobileBottomToolbarComponent,
	OverlayToolBarComponent,
	SelectedStringToolBarComponent,
} from '@overlays/toolbars/feature'
import { AppStateStoreService, DivElementsService } from '@canvas/app/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { ContextMenuRendererComponent } from '@overlays/context-menus/feature'
import { ObjectPositioningStoreService } from '@canvas/object-positioning/data-access'
import { map } from 'rxjs'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { selectSignalFromStore } from '@shared/utils'
import { selectSelectedStringId } from '@canvas/selected/data-access'
import { DialogRendererComponent } from '@overlays/dialogs/feature'
import { injectProjectsStore } from '@entities/data-access'
import { injectAuthStore } from '@auth/data-access'

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
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements OnInit, AfterViewInit {
	private _projectsStore = injectProjectsStore()
	private _authStore = injectAuthStore()
	private _renderer = inject(Renderer2)
	private _divElements = inject(DivElementsService)
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _dialog = toSignal(this._uiStore.dialog$, { initialValue: this._uiStore.dialog })
	private _contextMenu = toSignal(this._uiStore.contextMenu$, {
		initialValue: this._uiStore.contextMenu,
	})
	private _objectPositioningStore = inject(ObjectPositioningStoreService)

	private _objectPositioningState = toSignal(
		this._objectPositioningStore.state$.pipe(
			map((state) => ({
				moveEntityState: state.moveEntityState,
				toMoveSpotTaken: state.toMoveSpotTaken,
				rotateEntityState: state.rotateEntityState,
			})),
		),
		{
			initialValue: {
				moveEntityState: this._objectPositioningStore.state.moveEntityState,
				toMoveSpotTaken: this._objectPositioningStore.state.toMoveSpotTaken,
				rotateEntityState: this._objectPositioningStore.state.rotateEntityState,
			},
		},
	)
	user = this._authStore.select.user

	userProjects = this._projectsStore.select.allProjects
	isProjectReadyToRender = this._projectsStore.select.projectReadyToRender

	showProjectSpinner = computed(() => {
		return !this.isProjectReadyToRender() && !!this.user() && this.userProjects().length > 0
	})

	version = signal('1.0.1')
	showFpsState = toSignal(this._graphicsStore.state$.pipe(map((state) => state.showFps)), {
		initialValue: this._graphicsStore.state.showFps,
	})
	stringIsSelected = selectSignalFromStore(selectSelectedStringId)
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
		if (this.appStats) {
			const children = this.appStats.nativeElement.children
			for (let i = 0; i < children.length; i++) {
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
