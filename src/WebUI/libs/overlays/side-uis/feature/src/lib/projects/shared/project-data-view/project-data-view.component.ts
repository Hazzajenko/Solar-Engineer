import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { SideUiDataViewStore } from '../../side-ui-data-view/side-ui-data-view.store'
import { injectAppUser } from '@auth/data-access'
import { selectSignalFromStore } from '@shared/utils'
import { selectPanelsGroupedWithStringsAndStats } from './data-view.selectors'
import {
	ProjectWebModel,
	StringId,
	StringWithPanelsAndStats,
	UNDEFINED_STRING_NAME,
} from '@entities/shared'
import { injectSelectedStore } from '@canvas/selected/data-access'
import {
	ButtonAnimatedDownUpArrowComponent,
	ButtonContextMenuComponent,
	InputSvgComponent,
} from '@shared/ui'
import { LetDirective } from '@ngrx/component'
import { NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DefaultHoverEffectsDirective } from '@shared/directives'
import { SideUiViewHeadingComponent } from '../../../shared/ui'

@Component({
	selector: 'app-project-data-view',
	standalone: true,
	imports: [
		ButtonAnimatedDownUpArrowComponent,
		LetDirective,
		NgForOf,
		NgIf,
		ButtonContextMenuComponent,
		MatTooltipModule,
		InputSvgComponent,
		NgStyle,
		DefaultHoverEffectsDirective,
		SideUiViewHeadingComponent,
	],
	templateUrl: './project-data-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDataViewComponent {
	private _uiStore = inject(UiStoreService)
	private _selectedStore = injectSelectedStore()
	@Input({ required: true }) project!: ProjectWebModel
	panelsGroupedByStringWithStats = selectSignalFromStore(selectPanelsGroupedWithStringsAndStats)
	dataViewStore = inject(SideUiDataViewStore)
	user = injectAppUser()
	selectedStringId = this._selectedStore.select.selectedStringId
	protected readonly UNDEFINED_STRING_NAME = UNDEFINED_STRING_NAME

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

	deleteString(id: StringId) {
		console.log('deleteString', id)
	}

	openStringSettings(id: StringId) {
		console.log('openStringSettings', id)
	}

	selectStringInApp(id: StringId) {
		if (this._selectedStore.select.selectedStringId() === id) {
			this._selectedStore.dispatch.clearSelectedString()
			return
		}
		this._selectedStore.dispatch.selectStringId(id)
	}

	openChangeColourDialog(stringIdGroup: StringWithPanelsAndStats) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CHANGE_STRING_COLOUR,
			data: { stringId: stringIdGroup.string.id },
		})
		// this.stringColourOverlayOpen.set(true)
	}
}
