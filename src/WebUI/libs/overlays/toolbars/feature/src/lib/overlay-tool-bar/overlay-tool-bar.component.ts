import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgIf } from '@angular/common'
import { GraphicsStoreService, UiStoreService } from '@design-app/data-access'
import { ZippyTooltipDirective } from '@canvas/app/feature'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent, TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
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
	private _graphicsStore = inject(GraphicsStoreService)
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

	toggleColouredStrings() {
		this._graphicsStore.dispatch.toggleColouredStrings()
	}
}
