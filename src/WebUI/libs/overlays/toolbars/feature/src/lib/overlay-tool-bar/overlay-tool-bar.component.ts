import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core'
import { ToSafeHtmlPipe } from '@shared/utils'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent, TooltipComponent } from '@shared/ui'
import { ConvertTooltipPipe } from './convert-tooltip.pipe'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { NgIconComponent } from '@ng-icons/core'
import { goBottom } from '@shared/animations'
import { DynamicWidthDirective } from './dynamic-width.directive'
import { injectAuthStore } from '@auth/data-access'
import { LetDirective } from '@ngrx/component'

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
		NgStyle,
		DynamicWidthDirective,
		LetDirective,
	],
	hostDirectives: [MouseOverRenderDirective],
	animations: [goBottom],
})
export class OverlayToolBarComponent {
	private _uiStore = injectUiStore()
	private _authStore = injectAuthStore()
	private _graphicsStore = inject(GraphicsStoreService)
	user = this._authStore.select.user
	@ViewChild('toolBar') toolBar: ElementRef<HTMLDivElement> | undefined

	vm = computed(() => ({
		user: this._authStore.select.user(),
		sideUiEnabled: this._uiStore.select.sideUiNavOpen(),
	}))

	openSettingsDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.APP_SETTINGS,
		})
	}

	openProfileDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.PROFILE_SETTINGS,
		})
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

	toggleSideUi() {
		this._uiStore.dispatch.toggleSideUiNav()
	}

	toggleColouredStrings() {
		this._graphicsStore.dispatch.toggleColouredStrings()
	}

	undo() {
		console.log('implement undo')
	}

	redo() {
		console.log('implement redo')
	}
}
