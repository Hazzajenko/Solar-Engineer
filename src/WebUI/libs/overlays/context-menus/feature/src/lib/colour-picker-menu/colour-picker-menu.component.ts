import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { JsonPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { CONTEXT_MENU_COMPONENT, ContextMenuColourPickerMenu } from '@overlays/ui-store/data-access'
import { StringColor, stringColors, StringId, StringModel } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { injectAppStateStore } from '@canvas/app/data-access'
import { transitionContextMenu } from '../animations/context-menu.animation'
import { injectStringsStore, selectStringsEntities } from '@entities/data-access'
import { getSelectedSelectors } from '@canvas/selected/data-access'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { selectSignalFromStore } from '@shared/utils'
// import { selectSelectedString } from '@entities/utils'

const { selectSelectedStringId } = getSelectedSelectors()
const selectSelectedString = createSelector(
	selectSelectedStringId,
	selectStringsEntities,
	(selectedStringId: StringId | undefined, strings: Dictionary<StringModel>) => {
		return selectedStringId ? strings[selectedStringId] : undefined
	},
)

@Component({
	selector: 'app-colour-picker-menu',
	standalone: true,
	imports: [
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
		JsonPipe,
		ShowSvgNoStylesComponent,
		NgForOf,
		NgStyle,
		NgClass,
	],
	templateUrl: './colour-picker-menu.component.html',
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	animations: [transitionContextMenu],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColourPickerMenuComponent {
	private _appStore = injectAppStateStore()
	private _selectedString = selectSignalFromStore(selectSelectedString)
	private _stringsStore = injectStringsStore()

	id = CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuColourPickerMenu

	stringColors = stringColors as StringColor[]
	selectedStringColor = this._appStore.stringColor

	setStringColor(colour: StringColor) {
		const selectedString = this._selectedString()
		if (!selectedString) {
			console.error('no selected string')
			return
		}
		this._stringsStore.dispatch.updateString({
			id: selectedString.id,
			changes: {
				colour,
			},
		})
		this._appStore.setStringColor(colour)
	}
}
