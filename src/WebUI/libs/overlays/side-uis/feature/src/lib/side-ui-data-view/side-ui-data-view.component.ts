import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core'

import { toSignal } from '@angular/core/rxjs-interop'
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
// import { groupBy } from '@shared/utils'
import { LetDirective } from '@ngrx/component'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { GetStringByIdPipe, GetStringWithPanelIdsPipe, IsTypeOfPanelPipe } from '@entities/utils'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { PanelId, StringId, UNDEFINED_STRING_ID } from '@entities/shared'
import { groupBy } from 'lodash'
import { map } from 'rxjs'
import { injectEntityStore } from '@entities/data-access'

@Component({
	selector: 'side-ui-data-view',
	standalone: true,
	imports: [
		NgForOf,
		NgIf,
		GetStringByIdPipe,
		ShowSvgComponent,
		GetStringWithPanelIdsPipe,
		LetDirective,
		ShowSvgNoStylesComponent,
		TruncatePipe,
		NgClass,
		NgTemplateOutlet,
		IsTypeOfPanelPipe,
		RadiansToDegreesPipe,
	],
	templateUrl: './side-ui-data-view.component.html',
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiDataViewComponent {
	private _entityStore = injectEntityStore()
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = injectSelectedStore()
	// private _selectedStore = inject(SelectedStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels,
	})
	// private _panels = this._entityStore.panels.allPanels
	private _strings = this._entityStore.strings.select.allStrings
	private _multipleSelectedPanelIds = toSignal(this._selectedStore.multipleSelectedEntityIds$, {
		initialValue: this._selectedStore.selectMultipleSelectedPanelIds,
	})
	private _singleSelectedPanelId = toSignal(this._selectedStore.singleSelectedPanelId$, {
		initialValue: this._selectedStore.selectSingleSelectedPanelId,
	})
	private _selectedStringId = toSignal(this._selectedStore.selectedStringId$, {
		initialValue: this._selectedStore.selectedStringId,
	})
	private _panelsGroupedByStringId$ = this._entityStore.panels.allPanels$.pipe(
		map((panels) => {
			const grouped = groupBy(panels, 'stringId')
			const entries = Object.entries(grouped)
			return entries.map(([stringId, panels]) => {
				return {
					string: this._entityStore.strings.select.getById(stringId as StringId),
					panels,
				}
			})
		}),
	)
	private _panelsGroupedByStringId = toSignal(this._panelsGroupedByStringId$)
	_openedStrings = signal<Map<StringId, boolean>>(new Map().set(UNDEFINED_STRING_ID, true))
	protected readonly UndefinedStringId = UNDEFINED_STRING_ID

	constructor() {
		effect(
			() => {
				this._strings().forEach((string) => {
					if (!this._openedStrings().has(string.id)) {
						const map = new Map<StringId, boolean>(this.openedStrings)
						map.set(string.id, true)
						this._openedStrings.set(map)
					}
				})
				/*				if (!this._openedStrings().has(UndefinedStringId)) {
			 map.set(UndefinedStringId, true)
			 }*/
			},
			{ allowSignalWrites: true },
		)
	}

	get panels() {
		return this._panels()
	}

	get multipleSelectedPanelIds() {
		return this._multipleSelectedPanelIds()
	}

	get singleSelectedPanelId() {
		return this._singleSelectedPanelId()
	}

	get selectedStringId() {
		return this._selectedStringId()
	}

	get openedStrings() {
		return this._openedStrings()
	}

	get panelsGroupedByStringId() {
		/*		return this.panels.flatMap((panels) => {
		 const grouped = groupBy(panels, 'stringId')
		 const entries = Object.entries(grouped)
		 return entries.map(([stringId, panels]) => {
		 return {
		 string: this._entityStore.strings.select.getById(stringId),
		 panels,
		 }
		 })
		 })*/
		return this._panelsGroupedByStringId()
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
		this._openedStrings.set(new Map(this.openedStrings).set(id, !this.openedStrings.get(id)))
	}

	selectPanel(id: PanelId) {
		this._selectedStore.selectPanel(id)
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
		console.log('openPanelContextMenu', panelId)
		this._uiStore.dispatch.openContextMenu({
			location: {
				x: event.clientX,
				y: event.clientY,
			},
			component: 'app-single-panel-menu',
			data: { panelId },
		})
	}
}
