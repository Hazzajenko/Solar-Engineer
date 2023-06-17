import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	Injector,
	signal,
} from '@angular/core'
import { NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import {
	ButtonAnimatedDownUpArrowComponent,
	ButtonContextMenuComponent,
	InputSvgComponent,
	ShowSvgComponent,
	ShowSvgNoStylesComponent,
} from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import {
	calculateStringStatsForSelectedString,
	IsTypeOfPanelPipe,
	mapPanelToPanelWithConfig,
} from '@entities/utils'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import {
	PanelConfigModel,
	PanelId,
	PanelLinkModel,
	PanelModel,
	StringId,
	StringModel,
	StringWithPanels,
	StringWithPanelsAndStats,
	UNDEFINED_STRING_ID,
	UNDEFINED_STRING_NAME,
} from '@entities/shared'
import {
	injectEntityStore,
	injectProjectsStore,
	selectAllPanelLinksGroupedByStringId,
	selectAllPanelsGroupedByStringId,
	selectPanelConfigsEntities,
	selectStringsEntities,
} from '@entities/data-access'
import { assertNotNull, isNotNull, selectSignalFromStore } from '@shared/utils'
import { injectAppUser, injectAuthStore } from '@auth/data-access'
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
import { CenterThisElementDirective, DefaultHoverEffectsDirective } from '@shared/directives'
import {
	expandCollapse,
	heightInOutV2,
	heightInOutWithConfig,
	rotate180BasedOnOpenStateWithConfig,
	scaleAndOpacityAnimation,
} from '@shared/animations'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { MatTooltipModule } from '@angular/material/tooltip'
import { SideUiDataViewStore } from './side-ui-data-view.store'
import { AuthWebUserComponent } from '@auth/ui'
import {
	ChildContextMenuDirective,
	ChildContextMenuForClickDirective,
} from '@overlays/context-menus/feature'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'

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

// export const selectPanelLinksGroupedByStringId = createSelector(
// 	selectPanelLinksEntities,

export const selectPanelsGroupedWithStringsAndStats = createSelector(
	selectStringsEntities,
	selectPanelConfigsEntities,
	selectAllPanelsGroupedByStringId,
	selectAllPanelLinksGroupedByStringId,
	(
		strings: Dictionary<StringModel>,
		panelConfigs: Dictionary<PanelConfigModel>,
		panelsGroupedByStringId: Record<StringId, PanelModel[]>,
		panelLinksGroupedByStringId: Record<StringId, PanelLinkModel[]>,
	) => {
		const entries = Object.entries(panelsGroupedByStringId)
		return entries.map(([stringId, stringPanels]) => {
			const string = strings[stringId]
			assertNotNull(string)
			const panelLinksForString = panelLinksGroupedByStringId[string.id] ?? []
			const panelsWithSpecs = stringPanels.map((panel) => {
				const panelConfig = panelConfigs[panel.panelConfigId]
				assertNotNull(panelConfig)
				return mapPanelToPanelWithConfig(panel, panelConfig)
			})
			const stats = calculateStringStatsForSelectedString(
				stringPanels,
				panelLinksForString,
				panelsWithSpecs,
			)
			return {
				string,
				panels: stringPanels,
				stats,
			} as StringWithPanelsAndStats
		})
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
		InputSvgComponent,
		DefaultHoverEffectsDirective,
		CenterThisElementDirective,
		ButtonContextMenuComponent,
		ButtonAnimatedDownUpArrowComponent,
		MatTooltipModule,
		AuthWebUserComponent,
		ChildContextMenuDirective,
		ChildContextMenuForClickDirective,
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
	animations: [
		rotate180BasedOnOpenStateWithConfig(0.2),
		heightInOutWithConfig(0.2),
		expandCollapse,
		trigger('openClose', [
			state('true', style({ height: '*' })),
			state('false', style({ height: '0px' })),
			transition('false <=> true', animate(500)),
		]),
		heightInOutV2,
		scaleAndOpacityAnimation,
	],
})
export class SideUiDataViewComponent {
	private _authStore = injectAuthStore()
	private _entityStore = injectEntityStore()
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = injectSelectedStore()
	private _projectsStore = injectProjectsStore()
	public dataViewStore = inject(SideUiDataViewStore)
	private _openedString = this.dataViewStore.openedStringId
	user = injectAppUser()
	panelsGroupedByString = selectSignalFromStore(selectPanelsGroupedWithStringsAndStats)
	allStringsSelected = computed(() => {
		const selectedStringIds = this.dataViewStore.multiSelectedStringIds()
		return selectedStringIds.size === this.panelsGroupedByString().length
	})
	sideUiView = inject(Injector).get(sideUiInjectionToken) as SideUiNavBarView
	vm = computed(() => {
		const user = this._authStore.select.user()
		const project = this._projectsStore.select.selectedProject()
		const selectedStringId = this._selectedStore.select.selectedStringId()
		const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
		const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
		const openedStrings = this._openedString()
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

	openedString = computed(() => {
		const openedStringId = this.dataViewStore.openedStringId()
		if (!openedStringId) return undefined
		return this.panelsGroupedByString().find((string) => string.string.id === openedStringId)
	})
	stringColourOverlayOpen = signal(false)
	protected readonly UNDEFINED_STRING_NAME = UNDEFINED_STRING_NAME
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	// stringIdInColourMenu
	panelsGroupedByStringIdTrackByFn(index: number, item: StringWithPanelsAndStats) {
		return item.string.id || index
	}

	openStringContextMenu(event: MouseEvent, stringId: StringId) {
		this._uiStore.dispatch.openContextMenu({
			location: {
				x: event.clientX + 10,
				y: event.clientY + 10,
			},
			component: CONTEXT_MENU_COMPONENT.STRING_MENU,
			data: { stringId },
		})
	}

	toggleStringView(id: StringId) {
		this.dataViewStore.toggleStringView(id)
		// this._openedStrings.set(new Map(this._openedStrings()).set(id, !this._openedStrings().get(id)))
	}

	selectPanel(id: PanelId) {
		this._selectedStore.dispatch.selectPanel(id)
		this._render.renderCanvasApp()
	}

	openAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.select.allStrings().forEach((string) => map.set(string.id, true))
		map.set(UNDEFINED_STRING_ID, true)
		// this._openedStrings.set(map)
	}

	closeAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.select.allStrings().forEach((string) => map.set(string.id, false))
		map.set(UNDEFINED_STRING_ID, false)
		// this._openedStrings.set(map)
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

	toggleStringMultiSelect(stringIdGroup: StringWithPanelsAndStats) {
		// const isSelected = this._dataViewStore.multiSelectedStringIds().has(stringIdGroup.string.id)
		this.dataViewStore.toggleMultiSelectedStringId(stringIdGroup.string.id)
		/*		const set = new Set(this.multiSelectedStringIds())
		 if (isSelected) {
		 set.delete(stringIdGroup.string.id)
		 } else {
		 set.add(stringIdGroup.string.id)
		 }
		 this.multiSelectedStringIds.set(set)*/
	}

	selectAllStrings() {
		this.dataViewStore.selectAllStrings(
			this.panelsGroupedByString().map((stringIdGroup) => stringIdGroup.string.id),
		)
		/*		if (!this.allStringsSelected()) {
		 this.multiSelectedStringIds.set(
		 new Set(this.panelsGroupedByString().map((stringIdGroup) => stringIdGroup.string.id)),
		 )
		 return
		 }
		 this.multiSelectedStringIds.set(new Set())
		 console.log('selectAllStrings', this.multiSelectedStringIds())*/
	}

	deleteSelectedStrings() {
		// this.dataViewStore.deleteSelectedStrings()
		const multiSelectedStringIds = this.dataViewStore.multiSelectedStringIds()
		console.log('deleteSelectedStrings', multiSelectedStringIds)
		const multiSelectedStringIdsArray = Array.from(multiSelectedStringIds)
		console.log('multiSelectedStringIdsArray', multiSelectedStringIdsArray)
		// this._entityStore.strings.dispatch.deleteManyStrings(multiSelectedStringIdsArray)
		// this.multiSelectedStringIds.set(new Set())
	}

	deleteString(id: StringId) {
		console.log('deleteString', id)
	}

	openStringSettings(id: StringId) {
		console.log('openStringSettings', id)
	}

	selectStringInApp(id: StringId) {
		console.log('selectStringInApp', id)
		this._selectedStore.dispatch.selectStringId(id)
	}

	setStringColour(
		stringId: StringId,
		colour:
			| '#EF4444'
			| '#F97316'
			| '#EC4899'
			| '#6B7280'
			| '#10B981'
			| '#3B82F6'
			| '#F59E0B'
			| '#8B5CF6'
			| '#14B8A6'
			| '#6366F1',
	) {}

	openStringMenu(event: MouseEvent, stringIdGroup: StringWithPanelsAndStats) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CHANGE_STRING_COLOUR,
			data: { stringId: stringIdGroup.string.id },
		})
		// this.stringColourOverlayOpen.set(true)
	}
}
