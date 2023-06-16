import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { IsTypeOfPanelPipe } from '@entities/utils'
import { DIALOG_COMPONENT, UiStoreService } from '@overlays/ui-store/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import {
	PanelId,
	PanelModel,
	StringId,
	StringWithPanels,
	UNDEFINED_STRING_ID,
	UNDEFINED_STRING_NAME,
} from '@entities/shared'
import {
	injectEntityStore,
	injectProjectsStore,
	selectAllPanelsGroupedByStringId,
	selectStringsEntities,
} from '@entities/data-access'
import { isNotNull, selectSignalFromStore } from '@shared/utils'
import { injectAuthStore } from '@auth/data-access'
import { SideUiBaseComponent } from '../side-ui-base/side-ui-base.component'
import {
	sideUiInjectionToken,
	SideUiNavBarView,
} from '../side-ui-nav-bar/side-ui-nav-bar.component'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import {
	CdkFixedSizeVirtualScroll,
	CdkVirtualForOf,
	CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling'

export const selectPanelsGroupedWithStrings = createSelector(
	selectAllPanelsGroupedByStringId,
	selectStringsEntities,
	(panelsGroupedByStringId: Dictionary<PanelModel[]>, strings) => {
		const entries = Object.entries(panelsGroupedByStringId)
		const group = entries.map(([stringId, panels]) => {
			const string = strings[stringId]
			if (!string || !panels) return undefined
			return {
				string,
				panels,
			}
		})
		if (!group) return [] as StringWithPanels[]
		return group.filter(isNotNull) as StringWithPanels[]
	},
)

@Component({
	selector: 'side-ui-data-view',
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		ShowSvgComponent,
		LetDirective,
		ShowSvgNoStylesComponent,
		TruncatePipe,
		NgClass,
		NgTemplateOutlet,
		IsTypeOfPanelPipe,
		RadiansToDegreesPipe,
		NgStyle,
		SideUiBaseComponent,
		CdkVirtualScrollViewport,
		CdkVirtualForOf,
		CdkFixedSizeVirtualScroll,
	],
	templateUrl: './side-ui-data-view.component.html',
	styles: [
		`
			/* width */
			::-webkit-scrollbar {
				width: 10px;
			}

			/* Track */
			::-webkit-scrollbar-track {
				background: #f1f1f1;
			}

			/* Handle */
			::-webkit-scrollbar-thumb {
				background: #888;
			}

			/* Handle on hover */
			::-webkit-scrollbar-thumb:hover {
				background: #555;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiDataViewComponent {
	private _authStore = injectAuthStore()
	private _entityStore = injectEntityStore()
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = injectSelectedStore()
	private _projectsStore = injectProjectsStore()
	private _strings = this._entityStore.strings.select.allStrings
	/*	private _panelsGroupedByStringId = computed(() => {
	 const panels = this._entityStore.panels.select.allPanels()
	 const grouped = groupBy(panels, 'stringId')
	 const entries = Object.entries(grouped)
	 return entries.map(([stringId, panels]) => {
	 return {
	 string: this._entityStore.strings.select.getById(stringId as StringId),
	 panels,
	 }
	 })
	 })*/
	private _openedStrings = signal<Map<StringId, boolean>>(new Map().set(UNDEFINED_STRING_ID, true))
	panelsGroupedByString = selectSignalFromStore(selectPanelsGroupedWithStrings)
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
	vm = computed(() => {
		const user = this._authStore.select.user()
		const project = this._projectsStore.select.selectedProject()
		const selectedStringId = this._selectedStore.select.selectedStringId()
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		const openedStrings = this._openedStrings()
		const panelsGroupedByStringId = this.panelsGroupedByString()
		return {
			user,
			project,
			selectedStringId,
			multipleSelectedPanelIds,
			singleSelectedPanelId,
			openedStrings,
			panelsGroupedByStringId,
		}
	})
	protected readonly UndefinedStringId = UNDEFINED_STRING_ID
	protected readonly UNDEFINED_STRING_NAME = UNDEFINED_STRING_NAME

	constructor() {
		effect(
			() => {
				this._strings().forEach((string) => {
					if (!this._openedStrings().has(string.id)) {
						const map = new Map<StringId, boolean>(this._openedStrings())
						map.set(string.id, true)
						this._openedStrings.set(map)
					}
				})
			},
			{ allowSignalWrites: true },
		)
	}

	openStringContextMenu(event: MouseEvent, stringId: StringId) {
		this._uiStore.dispatch.openContextMenu({
			location: {
				x: event.clientX + 10,
				y: event.clientY + 10,
			},
			component: 'app-string-menu',
			data: { stringId },
		})
	}

	toggleStringView(id: StringId) {
		this._openedStrings.set(new Map(this._openedStrings()).set(id, !this._openedStrings().get(id)))
	}

	selectPanel(id: PanelId) {
		this._selectedStore.dispatch.selectPanel(id)
		this._render.renderCanvasApp()
	}

	openAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.select.allStrings().forEach((string) => map.set(string.id, true))
		map.set(UNDEFINED_STRING_ID, true)
		this._openedStrings.set(map)
	}

	closeAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.select.allStrings().forEach((string) => map.set(string.id, false))
		map.set(UNDEFINED_STRING_ID, false)
		this._openedStrings.set(map)
	}

	openPanelContextMenu(event: MouseEvent, panelId: PanelId) {
		event.preventDefault()
		event.stopPropagation()
		this._uiStore.dispatch.openContextMenu({
			location: {
				x: event.clientX,
				y: event.clientY,
			},
			component: 'app-single-panel-menu',
			data: { panelId },
		})
	}

	openSignInDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN,
		})
	}
}
