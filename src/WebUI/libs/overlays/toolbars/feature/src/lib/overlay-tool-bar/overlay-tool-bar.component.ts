import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgIf } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent, TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroUsers } from '@ng-icons/heroicons/outline'

// import { ZippyTooltipDirective } from '@canvas/app/feature'
// NG_ICON_DIRECTIVES
// heroAcademicCapSolid
@Component({
	selector: 'overlay-tool-bar-component',
	standalone: true,
	templateUrl: 'overlay-tool-bar.component.html',
	imports: [
		NgClass,
		MatTooltipModule,
		TooltipComponent,
		ToSafeHtmlPipe,
		ConvertTooltipPipe,
		ShowSvgNoStylesComponent,
		NgIf,
		ToggleSvgNoStylesComponent,
		NgIconComponent, // ZippyTooltipDirective,
	],
	providers: [provideIcons({ heroUsers })],
	hostDirectives: [MouseOverRenderDirective],
})
export class OverlayToolBarComponent {
	private _uiStore = inject(UiStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	showToolbar = true
	sideUiEnabled = toSignal(this._uiStore.sideUiNav$, { initialValue: this._uiStore.sideUiNav })
	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	get sideUiNavOpen() {
		return this.sideUiEnabled()
	}

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			component: 'AppSettingsDialogComponent',
		})
		// heroAcademicCapSolid
	}

	toggleSideUi() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	toggleColouredStrings() {
		this._graphicsStore.dispatch.toggleColouredStrings()
	}
}
