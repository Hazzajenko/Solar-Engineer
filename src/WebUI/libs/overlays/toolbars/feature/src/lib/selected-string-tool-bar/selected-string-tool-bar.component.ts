import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { NgClass, NgStyle } from '@angular/common'
import { selectSignalFromStore } from '@shared/utils'
import { injectAppStateStore, selectModeState } from '@canvas/app/data-access'
import { CssToggleDirective } from '@shared/directives'
import { goBottom } from '@shared/animations'

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
	showToolbar = true
	appMode = selectSignalFromStore(selectModeState)

	toggleLinkMode() {
		if (this.appMode() === 'SelectMode' || this.appMode() === 'CreateMode') {
			this._appStore.setModeState('LinkMode')
			return
		}

		this._appStore.setModeState('SelectMode')
	}
}
