import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core'
import { NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
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
import { map } from 'rxjs'
import { groupBy } from '@shared/utils'
import { fadeInOutAnimation } from '@shared/animations'
import { MatMenuTrigger } from '@angular/material/menu'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { TruncatePipe } from '@shared/pipes'
import { PanelId, StringId } from '@design-app/shared'

@Component({
	selector: 'app-data-view-panels',
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
	templateUrl: './data-view-panels.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOutAnimation],
})
export class DataViewPanelsComponent {
	private _entityStore = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	private _render = inject(RenderService)
	private _selectedStore = inject(SelectedStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels,
	})
	private _multipleSelectedPanelIds = toSignal(this._selectedStore.multipleSelectedEntityIds$, {
		initialValue: this._selectedStore.multipleSelectedEntityIds,
	})
	private _singleSelectedPanelId = toSignal(this._selectedStore.singleSelectedPanelId$, {
		initialValue: this._selectedStore.singleSelectedPanelId,
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
					string: this._entityStore.strings.getById(stringId),
					panels,
				}
			})
		}),
	)
	private _panelsGroupedByStringId = toSignal(this._panelsGroupedByStringId$)
	_openedStrings = signal<Map<StringId, boolean>>(
		(() => {
			const map = new Map<StringId, boolean>()
			this._entityStore.strings.allStrings.forEach((string) => map.set(string.id, false))
			return map
		})(),
	)
	menuTopLeftPosition = { x: '0', y: '0' }
	@ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger

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
		return this._panelsGroupedByStringId()
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
}
