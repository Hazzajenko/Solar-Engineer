import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import {
	GetOptionCheckedPipe,
	GraphicsStateBooleansKeys,
} from '../graphics-settings/get-option-checked.pipe'
import { NgForOf } from '@angular/common'
import { LetDirective } from '@ngrx/component'
import { StringManipulatePipe } from '@shared/pipes'
import { toSignal } from '@angular/core/rxjs-interop'
import { GraphicsStoreService } from '@canvas/graphics/data-access'

@Component({
	selector: 'app-display-settings',
	standalone: true,
	imports: [NgForOf, LetDirective, StringManipulatePipe, GetOptionCheckedPipe],
	templateUrl: './display-settings.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplaySettingsComponent {
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
