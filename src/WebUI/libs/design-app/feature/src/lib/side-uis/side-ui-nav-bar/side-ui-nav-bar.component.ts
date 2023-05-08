import { Component, inject } from '@angular/core'
import { NgIf } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { UiStoreService } from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
	selector: 'side-ui-nav-bar',
	standalone: true,
	templateUrl: 'side-ui-nav-bar.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [NgIf],
})
export class SideUiNavBarComponent {
	private _uiStore = inject(UiStoreService)
	private _sideUiNavBarOpen = toSignal(this._uiStore.sideUiNav$, {
		initialValue: this._uiStore.sideUiNav,
	})
	get sideUiNavBarOpen() {
		return this._sideUiNavBarOpen()
	}

	toggle() {
		this._uiStore.dispatch.toggleSideUiNav()
	}
}
