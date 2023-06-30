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
	Renderer2,
	Signal,
	signal,
	ViewChild,
} from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { LetDirective } from '@ngrx/component'
import {
	ActionsNotificationComponent,
	ButtonBuilderComponent,
	InputSvgComponent,
	ShowSvgComponent,
	UndoActionNotificationComponent,
} from '@shared/ui'

import { CdkDrag } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { OverlayNotificationModalComponent } from '@overlays/notifications/feature'
import { SideUiAuthViewComponent, SideUiNavBarComponent } from '@overlays/side-uis/feature'
import {
	MobileBottomToolbarComponent,
	MobileSideActionToolbarComponent,
	OverlayToolBarComponent,
	SelectedStringToolBarComponent,
} from '@overlays/toolbars/feature'
import { DivElementsService, injectAppStateStore } from '@canvas/app/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'
import { ContextMenuRendererComponent } from '@overlays/context-menus/feature'
import { injectObjectPositioningStore } from '@canvas/object-positioning/data-access'
import { map } from 'rxjs'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { selectSignalFromStore } from '@shared/utils'
import { selectSelectedStringId } from '@canvas/selected/data-access'
import { DialogRendererComponent } from '@overlays/dialogs/feature'
import { injectProjectsStore } from '@entities/data-access'
import { injectAuthStore } from '@auth/data-access'
import { LoadingProjectSpinnerComponent } from '../ui/loading-project-spinner/loading-project-spinner.component'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { environment } from '@shared/environment'

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
		OverlayNotificationModalComponent,
		SideUiNavBarComponent,
		OverlayToolBarComponent,
		ContextMenuRendererComponent,
		SelectedStringToolBarComponent,
		MobileBottomToolbarComponent,
		DialogRendererComponent,
		SideUiAuthViewComponent,
		LoadingProjectSpinnerComponent,
		MobileSideActionToolbarComponent,
		DefaultHoverEffectsDirective,
		InputSvgComponent,
	],
	selector: 'app-design-canvas-app',
	standalone: true,
	styles: [],
	templateUrl: './design-canvas-app.component.html',
})
export class DesignCanvasAppComponent implements AfterViewInit {
	private _projectsStore = injectProjectsStore()
	private _authStore = injectAuthStore()
	private _renderer = inject(Renderer2)
	private _divElements = inject(DivElementsService)
	private _appStore = injectAppStateStore()
	private _uiStore = injectUiStore()
	private _graphicsStore = inject(GraphicsStoreService)
	private _objectPositioningStore = injectObjectPositioningStore()

	isDevelopment = !environment.production

	user = this._authStore.select.user
	sideUiMobileMenuOpen = this._uiStore.select.sideUiMobileMenuOpen as Signal<boolean>
	sideUiNavBarOpen = this._uiStore.select.sideUiNavOpen as Signal<boolean>
	userProjects = this._projectsStore.select.allProjects
	isProjectReadyToRender = this._projectsStore.select.projectReadyToRender

	showProjectSpinner = computed(() => {
		return !this.isProjectReadyToRender() && !!this.user() && this.userProjects().length > 0
	})

	version = signal('1.0.8')
	showFpsState = toSignal(this._graphicsStore.state$.pipe(map((state) => state.showFps)), {
		initialValue: this._graphicsStore.state.showFps,
	})
	stringIsSelected = selectSignalFromStore(selectSelectedStringId)
	@ViewChild('appStats', { static: true }) appStats!: ElementRef<HTMLDivElement>
	cursorState = computed(() => {
		const { moveEntityState, toMoveSpotTaken, rotateEntityState } =
			this._objectPositioningStore.select.cursorState()
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

		const viewPositioningState = this._appStore.select.view()

		if (viewPositioningState === 'ViewDraggingInProgress') {
			return 'move'
		}

		return ''
	})

	constructor() {
		this.waitForElements()
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

	toggleSideUiNav() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	clearLocalStorage() {
		localStorage.clear()
	}
}
