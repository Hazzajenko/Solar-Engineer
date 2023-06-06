import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { NgClass, NgStyle } from '@angular/common'
import { selectSignalFromStore } from '@shared/utils'
import { injectAppStateStore, selectModeState } from '@canvas/app/data-access'
import { CssToggleDirective } from '@shared/directives'
import { goBottom } from '@shared/animations'
import { CONTEXT_MENU_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'

@Component({
	selector: 'overlay-selected-string-tool-bar',
	standalone: true,
	imports: [
		ShowSvgNoStylesComponent,
		ToggleSvgNoStylesComponent,
		NgClass,
		NgStyle,
		CssToggleDirective,
	],
	templateUrl: './selected-string-tool-bar.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [goBottom],
})
export class SelectedStringToolBarComponent {
	private _appStore = injectAppStateStore()
	private _uiStore = injectUiStore()
	showToolbar = true
	appMode = selectSignalFromStore(selectModeState)

	toggleLinkMode() {
		if (this.appMode() === 'SelectMode' || this.appMode() === 'CreateMode') {
			this._appStore.dispatch.setModeState('LinkMode')
			return
		}

		this._appStore.dispatch.setModeState('SelectMode')
	}

	openColourPicker(changeColourButton: HTMLButtonElement, toolBar: HTMLDivElement) {
		const rect = changeColourButton.getBoundingClientRect()

		const location = { x: rect.left, y: rect.top + rect.height }
		location.y += 10
		const toolbarRect = toolBar.getBoundingClientRect()
		const right = toolbarRect.right

		this._uiStore.dispatch.openContextMenu({
			component: CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU,
			location,
			data: {
				left: rect.left,
				right,
			},
		})
	}
}
