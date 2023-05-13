import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import {
	GetOptionCheckedPipe,
	GraphicsStateBooleansKeys,
} from '../graphics-settings/get-option-checked.pipe'
import { NgForOf } from '@angular/common'
import { LetDirective } from '@ngrx/component'
import { StringManipulatePipe } from '@shared/pipes'
import { GraphicsStoreService } from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'

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
	get graphicsState() {
		return this._graphicsState()
	}

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
	]
}
