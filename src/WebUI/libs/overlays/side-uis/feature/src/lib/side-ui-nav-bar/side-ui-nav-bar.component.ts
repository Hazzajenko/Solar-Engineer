import { Component, inject, signal } from '@angular/core'
import { NgIf } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { toSignal } from '@angular/core/rxjs-interop'
import { LogoComponent } from '@shared/ui/logo'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { SideUiDataViewComponent } from '../side-ui-data-view/side-ui-data-view.component'
import { UiStoreService } from '@overlays/ui-store/data-access'

@Component({
	selector: 'side-ui-nav-bar',
	standalone: true,
	templateUrl: 'side-ui-nav-bar.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [
		NgIf,
		LogoComponent,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		SideUiDataViewComponent,
	],
	hostDirectives: [MouseOverRenderDirective],
})
export class SideUiNavBarComponent {
	private _uiStore = inject(UiStoreService)
	private _sideUiNavBarOpen = toSignal(this._uiStore.sideUiNav$, {
		initialValue: this._uiStore.sideUiNav,
	})

	private _dataView = signal(false)

	get dataView() {
		return this._dataView()
	}

	get sideUiNavBarOpen() {
		return this._sideUiNavBarOpen()
	}

	toggle() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	toggleDataView() {
		this._dataView.set(!this._dataView())
	}
}