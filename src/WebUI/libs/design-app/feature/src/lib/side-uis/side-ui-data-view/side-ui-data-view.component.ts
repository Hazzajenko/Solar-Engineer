import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core'
import {
	EntityStoreService,
	GetStringByIdPipe,
	GetStringWithPanelIdsPipe,
	IsTypeOfPanelPipe,
	RenderService,
	SelectedStoreService,
	UiStoreService,
} from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { PanelId, StringId, UndefinedStringId } from '@design-app/shared'
import { map } from 'rxjs'
import { groupBy } from '@shared/utils'
import { LetDirective } from '@ngrx/component'
import { TruncatePipe } from '@shared/pipes'

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
	],
	templateUrl: './side-ui-data-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiDataViewComponent {
	private _entityStore = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = inject(SelectedStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels,
	})
	private _strings = toSignal(
		this._entityStore.strings.allStrings$ /*.pipe(
	 tap((strings) => {
	 strings.forEach((string) => {
	 if (!this._openedStrings().has(string.id)) {
	 console.log('!this._openedStrings().has(string.id)', string.id)
	 const map = new Map<StringId, boolean>(this.openedStrings)
	 map.set(string.id, true)
	 this._openedStrings.set(map)
	 }
	 })
	 }),
	 )*/,
		{
			initialValue: this._entityStore.strings.allStrings,
		},
	)

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

	_openedStrings = signal<Map<StringId, boolean>>(new Map())

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
		return this._panelsGroupedByStringId()
	}

	constructor() {
		effect(
			() => {
				this._strings().forEach((string) => {
					if (!this._openedStrings().has(string.id)) {
						console.log('!this._openedStrings().has(string.id)', string.id)
						const map = new Map<StringId, boolean>(this.openedStrings)
						map.set(string.id, true)
						this._openedStrings.set(map)
					}
				})
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
		this._entityStore.strings.allStrings.forEach((string) => map.set(string.id, true))
		map.set(UndefinedStringId, true)
		this._openedStrings.set(map)
	}

	closeAllStrings() {
		const map = new Map<StringId, boolean>()
		this._entityStore.strings.allStrings.forEach((string) => map.set(string.id, false))
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
