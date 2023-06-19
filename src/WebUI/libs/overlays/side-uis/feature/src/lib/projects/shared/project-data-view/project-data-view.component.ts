import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { SideUiDataViewStore } from './side-ui-data-view.store'
import { injectAppUser } from '@auth/data-access'
import { isMobile, selectSignalFromStore } from '@shared/utils'
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
import { SideUiViewHeadingComponent } from '../../../shared'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { heightInOutWithConfig } from '@shared/animations'
import { DataViewStringItemComponent } from './data-view-string-item/data-view-string-item.component'

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
		MatExpansionModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
		DataViewStringItemComponent,
	],
	templateUrl: './project-data-view.component.html',
	styles: [
		`
			@import './mat-expansion.scss';

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

			.mat-expansion-panel-header-description {
				justify-content: space-between;
				align-items: center;
			}

			.mat-expansion-panel-body {
				padding: 0 !important;
			}

			.mat-expansion-indicator {
				color: #313030 !important;
			}
		`,
	],
	animations: [heightInOutWithConfig(0.2)],
	encapsulation: ViewEncapsulation.None,
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
	protected readonly isMobile = isMobile

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
	}

	startOpeningAccord(id: StringId) {
		this.dataViewStore.toggleStringView(id)
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

	openChangeColourDialog(stringId: StringId) {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CHANGE_STRING_COLOUR,
			data: { stringId },
		})
	}
}
