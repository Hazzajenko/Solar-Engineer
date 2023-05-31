import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { ContextMenuColourPickerMenu } from '@overlays/ui-store/data-access'
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

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuColourPickerMenu

	stringColors = stringColors as StringColor[]
	selectedStringColor = this._appStore.stringColor

	setStringColor(color: StringColor) {
		this._appStore.setStringColor(color)
	}
}
