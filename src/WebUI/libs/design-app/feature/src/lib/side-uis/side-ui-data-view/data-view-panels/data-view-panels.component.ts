import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core'
import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common'
import { MatListModule } from '@angular/material/list'
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
import { CastPipe, TruncatePipe } from '@shared/pipes'
import { PanelId, StringId } from '@design-app/shared'

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
		NgTemplateOutlet,
		CastPipe,
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
	get openedStrings() {
		return this._openedStrings()
	}

	menuTopLeftPosition = { x: '0', y: '0' }
	@ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger

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
