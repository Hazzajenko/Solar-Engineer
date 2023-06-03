import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { CONTEXT_MENU_COMPONENT, ContextMenuColourPickerMenu } from '@overlays/ui-store/data-access'
import { StringColor, stringColors } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { injectAppStateStore } from '@canvas/app/data-access'
import { transitionContextMenu } from '../animations/context-menu.animation'

@Component({
	selector: 'app-colour-picker-menu',
	standalone: true,
	imports: [
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
		JsonPipe,
		ShowSvgNoStylesComponent,
		NgForOf,
		NgStyle,
	],
	templateUrl: './colour-picker-menu.component.html',
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	animations: [transitionContextMenu],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColourPickerMenuComponent {
	private _appStore = injectAppStateStore()

	id = CONTEXT_MENU_COMPONENT.COLOUR_PICKER_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuColourPickerMenu

	stringColors = stringColors as StringColor[]
	selectedStringColor = this._appStore.stringColor

	setStringColor(color: StringColor) {
		this._appStore.setStringColor(color)
	}

	/*	fixLeftPosition(event: UIEvent) {
	 const toolbar = document.getElementById('overlay-toolbar')
	 if (!toolbar) {
	 console.error('no toolbar')
	 return
	 }
	 const toolbarRect = toolbar.getBoundingClientRect()
	 const left = toolbarRect.left

	 }*/
}
