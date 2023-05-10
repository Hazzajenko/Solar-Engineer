import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core'
import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import {
	EntityStoreService,
	GetStringByIdPipe,
	GetStringWithPanelIdsPipe,
	SelectedStoreService,
	UiStoreService,
} from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import {
	CdkFixedSizeVirtualScroll,
	CdkVirtualForOf,
	CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling'
import { map } from 'rxjs'
import { groupBy } from '@shared/utils'
import { fadeInOutAnimation } from '@shared/animations'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { InputContextMenuDirective } from '../../../input-context-menu.directive'
import { TruncatePipe } from '@shared/pipes'
import { StringId } from '@design-app/shared'

@Component({
	selector: 'app-data-view-panels',
	standalone: true,
	imports: [
		DatePipe,
		MatListModule,
		NgForOf,
		JsonPipe,
		NgIf, // CdkVirtualScrollViewport,
		CdkVirtualForOf,
		CdkFixedSizeVirtualScroll,
		CdkVirtualScrollViewport,
		MatMenuModule,
		GetStringByIdPipe,
		ShowSvgComponent,
		GetStringWithPanelIdsPipe,
		LetDirective,
		InputContextMenuDirective,
		ShowSvgNoStylesComponent,
		TruncatePipe,
		NgClass,
	],
	templateUrl: './data-view-panels.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOutAnimation],
})
export class DataViewPanelsComponent {
	private _entityStore = inject(EntityStoreService)
	private _uiStore = inject(UiStoreService)
	private _selectedStore = inject(SelectedStoreService)
	private _panels = toSignal(this._entityStore.panels.allPanels$, {
		initialValue: this._entityStore.panels.allPanels,
	})
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

	_openedStrings = signal<Map<StringId, boolean>>(
		(() => {
			const map = new Map<StringId, boolean>()
			this._entityStore.strings.allStrings.forEach((string) => map.set(string.id, false))
			return map
		})(),
	)
	// _openedStrings = signal<Record<string, boolean>>(this._entityStore.strings.allStrings.map((string) => ({ [string.id]: false })).reduce((a, b) => ({ ...a, ...b }), {}))
	get openedStrings() {
		return this._openedStrings()
	}

	menuTopLeftPosition = { x: '0', y: '0' }
	@ViewChild(MatMenuTrigger, { static: true })
	matMenuTrigger!: MatMenuTrigger

	// protected readonly ContextMenuInput = ContextMenuInput

	private _panelsGroupedByStringId$ = this._entityStore.panels.allPanels$.pipe(
		// groupBy((panel) => panel.map((panel) => panel.stringId))
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

	idk() {
		for (const stringId in this.panelsGroupedByStringId) {
			console.log(stringId)
		}
	}

	onOptionsClick(event: MouseEvent, stringId: string) {
		event.preventDefault()
		this.menuTopLeftPosition.x = event.clientX + 10 + 'px'
		this.menuTopLeftPosition.y = event.clientY + 10 + 'px'
		console.log('onOptionsClick()', stringId)
		console.log('menuTopLeftPosition.x', this.menuTopLeftPosition.x)
		console.log('menuTopLeftPosition.y', this.menuTopLeftPosition.y)

		this.matMenuTrigger.menuData = { stringId }
		this.matMenuTrigger.openMenu()
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

	/*		map((panels) => {
			const grouped = groupBy(panels, (panel) => panel.stringId)
			return Object.entries(grouped)
		})*/
	// protected readonly of = of

	toggleStringView(id: StringId) {
		// const openedStrings = this.openedStrings
		// openedStrings[id] = !openedStrings[id]
		this._openedStrings.set(new Map(this.openedStrings).set(id, !this.openedStrings.get(id)))
	}
}
