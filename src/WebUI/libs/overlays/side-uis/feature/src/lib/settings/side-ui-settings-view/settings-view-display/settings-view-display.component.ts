import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import {
	GetOptionCheckedPipe,
	GraphicsStateBooleansKeys,
} from '../../../../../../../dialogs/feature/src/lib/app-settings-dialog/graphics-settings/get-option-checked.pipe'
import { LetDirective } from '@ngrx/component'
import { NgForOf } from '@angular/common'
import { StringManipulatePipe } from '@shared/pipes'

@Component({
	selector: 'app-settings-view-display',
	standalone: true,
	imports: [GetOptionCheckedPipe, LetDirective, NgForOf, StringManipulatePipe],
	templateUrl: './settings-view-display.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewDisplayComponent {
	private _graphicsStore = inject(GraphicsStoreService)
	private _graphicsState = toSignal(this._graphicsStore.state$, {
		initialValue: this._graphicsStore.state,
	})
	toggleOptions: {
		toggle: () => void
		name: GraphicsStateBooleansKeys
		label: string
	}[] = [
		{
			toggle: () => this._graphicsStore.dispatch.toggleNotifications(),
			name: 'notifications',
			label: 'Notifications',
		},
		{
			toggle: () => this._graphicsStore.dispatch.toggleShowFPS(),
			name: 'showFps',
			label: 'FPS',
		},
	]

	get graphicsState() {
		return this._graphicsState()
	}
}
