import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent, TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { NgIconComponent, provideIcons } from '@ng-icons/core'
import { heroUsers } from '@ng-icons/heroicons/outline'
import { goBottom } from '@shared/animations'
import { ColourPickerMenuV2Component } from '@overlays/context-menus/feature'
import { DynamicWidthDirective } from './dynamic-width.directive'

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
		NgIconComponent,
		NgForOf,
		ColourPickerMenuV2Component,
		NgStyle,
		DynamicWidthDirective,
		// ZippyTooltipDirective,
	],
	providers: [provideIcons({ heroUsers })],
	hostDirectives: [MouseOverRenderDirective],
	animations: [goBottom],
})
export class OverlayToolBarComponent {
	private _uiStore = inject(UiStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	// showToolbar = true
	sideUiEnabled = toSignal(this._uiStore.sideUiNav$, { initialValue: this._uiStore.sideUiNav })
	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	// protected readonly stringColors = stringColors

	get sideUiNavOpen() {
		return this.sideUiEnabled()
	}

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			// component: DIALOG_COMPONENT_TYPE.APP_SETTINGS,
			component: 'AppSettingsDialogComponent',
		})
	}

	openProfileDialog() {
		this._uiStore.dispatch.openDialog({
			// component: DIALOG_COMPONENT_TYPE.PROFILE_SETTINGS,
			// component: DIALOG_COMPONENT_TYPE.PROFILE_SETTINGS,
			component: 'ProfileSettingsDialogComponent',
		})
	}

	openColourPicker(changeColourButton: HTMLButtonElement, toolBar: HTMLDivElement) {
		const rect = changeColourButton.getBoundingClientRect()

		const location = { x: rect.left, y: rect.top + rect.height }
		location.y += 10
		const toolbarRect = toolBar.getBoundingClientRect()
		const right = toolbarRect.right

		this._uiStore.dispatch.openContextMenu({
			component: 'app-colour-picker-menu',
			location,
			data: {
				left: rect.left,
				right,
			},
		})
	}

	toggleSideUi() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	toggleColouredStrings() {
		this._graphicsStore.dispatch.toggleColouredStrings()
	}
}
