import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { calculateTopLeft, ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgIf } from '@angular/common'
import { UiStoreService } from '@design-app/data-access'
import { ZippyTooltipDirective } from '../../zippy-tooltip.directive'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent, TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '../../mouse-over-render.directive'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
	selector: 'overlay-tool-bar-component',
	standalone: true,
	templateUrl: 'overlay-tool-bar.component.html',
	imports: [
		NgClass,
		ZippyTooltipDirective,
		MatTooltipModule,
		TooltipComponent,
		ToSafeHtmlPipe,
		ConvertTooltipPipe,
		ShowSvgNoStylesComponent,
		NgIf,
		ToggleSvgNoStylesComponent,
	],
	hostDirectives: [MouseOverRenderDirective],
})
export class OverlayToolBarComponent {
	private _uiStore = inject(UiStoreService)
	showToolbar = true
	sideUiEnabled = toSignal(this._uiStore.sideUiNav$, { initialValue: this._uiStore.sideUiNav })

	get sideUiNavOpen() {
		return this.sideUiEnabled()
	}

	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			component: 'AppSettingsDialogComponent',
		})
	}

	toggleSideUi() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	protected readonly calculateTopLeft = calculateTopLeft
}
