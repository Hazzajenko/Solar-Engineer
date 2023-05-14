import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core'

import { toSignal } from '@angular/core/rxjs-interop'
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
// import { groupBy } from '@shared/utils'
import { LetDirective } from '@ngrx/component'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { GetStringByIdPipe, GetStringWithPanelIdsPipe, IsTypeOfPanelPipe } from '@entities/utils'
import { EntityStoreService } from '@entities/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { SelectedStoreService } from '@canvas/selected/data-access'
import { PanelId, StringId, UndefinedStringId } from '@entities/shared'
import { groupBy } from 'lodash'
import { map } from 'rxjs'

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
	private _entityStore = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = inject(SelectedStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels(),
	})
	// private _panels = this._entityStore.panels.allPanels
	private _strings = toSignal(this._entityStore.strings.allStrings$, {
		initialValue: this._entityStore.strings.allStrings(),
	})

	protected readonly UndefinedStringId = UndefinedStringId

	get panels() {
		return this._panels()
	}

	private _multipleSelectedPanelIds = toSignal(this._selectedStore.multipleSelectedEntityIds$, {
		initialValue: this._selectedStore.multipleSelectedEntityIds,
	})

	get multipleSelectedPanelIds() {
		return this._multipleSelectedPanelIds()
	}

	private _singleSelectedPanelId = toSignal(this._selectedStore.singleSelectedEntityId$, {
		initialValue: this._selectedStore.singleSelectedEntityId,
	})

	get singleSelectedPanelId() {
		return this._singleSelectedPanelId()
	}

	private _selectedStringId = toSignal(this._selectedStore.selectedStringId$, {
		initialValue: this._selectedStore.selectedStringId,
	})

	get selectedStringId() {
		return this._selectedStringId()
	}

	_openedStrings = signal<Map<StringId, boolean>>(new Map().set(UndefinedStringId, true))

	get openedStrings() {
		return this._openedStrings()
	}

	private _panelsGroupedByStringId$ = this._entityStore.panels.allPanels$.pipe(
		map((panels) => {
			const grouped = groupBy(panels, 'stringId')
			const entries = Object.entries(grouped)
			return entries.map(([stringId, panels]) => {
				return {
					string: this._entityStore.strings.getById(stringId),
					panels,
				}
			})
		}),
	)

	private _panelsGroupedByStringId = toSignal(this._panelsGroupedByStringId$)
	get panelsGroupedByStringId() {
		/*		return this.panels.flatMap((panels) => {
		 const grouped = groupBy(panels, 'stringId')
		 const entries = Object.entries(grouped)
		 return entries.map(([stringId, panels]) => {
		 return {
		 string: this._entityStore.strings.getById(stringId),
		 panels,
		 }
		 })
		 })*/
		return this._panelsGroupedByStringId()
	}

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

	openStringContextMenu(event: MouseEvent, stringId: string) {
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
		this._selectedStore.dispatch.selectEntity(id)
		this._render.renderCanvasApp()
	}

	openAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.allStrings().forEach((string) => map.set(string.id, true))
		map.set(UndefinedStringId, true)
		this._openedStrings.set(map)
	}

	closeAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.allStrings().forEach((string) => map.set(string.id, false))
		map.set(UndefinedStringId, false)
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
