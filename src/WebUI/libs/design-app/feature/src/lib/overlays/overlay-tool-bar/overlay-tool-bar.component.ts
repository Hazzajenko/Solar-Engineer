import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { calculateTopLeft, ToSafeHtmlPipe } from '@shared/utils'
import { NgClass } from '@angular/common'
import { UiStoreService } from '@design-app/data-access'
import { ZippyTooltipDirective } from '../../zippy-tooltip.directive'
import { MatTooltipModule } from '@angular/material/tooltip'
import { TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'

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
	],
})
export class OverlayToolBarComponent {
	private _uiStore = inject(UiStoreService)
	showToolbar = true

	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	protected readonly WINDOW = window

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			component: 'AppSettingsDialogComponent',
		})
	}

	protected readonly calculateTopLeft = calculateTopLeft
}
