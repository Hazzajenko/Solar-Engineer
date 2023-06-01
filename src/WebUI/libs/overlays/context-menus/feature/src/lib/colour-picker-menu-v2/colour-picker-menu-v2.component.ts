import { ChangeDetectionStrategy, Component } from '@angular/core'
import { JsonPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { StringColor, stringColors } from '@entities/shared'
import { ContextMenuDirective } from '../directives'
import { injectAppStateStore } from '@canvas/app/data-access'
import { transitionContextMenu } from '../animations/context-menu.animation'

@Component({
	selector: 'app-colour-picker-menu-v2',
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
	templateUrl: './colour-picker-menu-v2.component.html',
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
export class ColourPickerMenuV2Component {
	private _appStore = injectAppStateStore()
	stringColors = stringColors as StringColor[]
	selectedStringColor = this._appStore.stringColor

	setStringColor(color: StringColor) {
		this._appStore.setStringColor(color)
	}
}
