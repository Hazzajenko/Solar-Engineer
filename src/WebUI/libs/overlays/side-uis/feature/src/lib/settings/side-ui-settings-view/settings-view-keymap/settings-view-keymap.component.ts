import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { KEY_MAP_ACTION, KeyMapAction, KeysStoreService } from '@canvas/keys/data-access'
import { toSignal } from '@angular/core/rxjs-interop'
import { Key, KEYS } from '@shared/data-access/models'
import { FormsModule } from '@angular/forms'
import { NgForOf, UpperCasePipe } from '@angular/common'
import { StringManipulatePipe } from '@shared/pipes'

@Component({
	selector: 'app-settings-view-keymap',
	standalone: true,
	imports: [FormsModule, NgForOf, StringManipulatePipe, UpperCasePipe],
	templateUrl: './settings-view-keymap.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsViewKeymapComponent {
	private _keysStore = inject(KeysStoreService)
	private _keyMap = toSignal(this._keysStore.keyMap$, { initialValue: this._keysStore.keyMap })
	keyMap$ = this._keysStore.keyMap$
	keyMapActions = Object.values(KEY_MAP_ACTION) as KeyMapAction[]
	keyMapKeys = Object.values(KEYS) as Key[]

	constructor() {
		console.log('keyMap', this.keyMap)
	}

	get keyMap() {
		return this._keyMap()
	}

	changeKey(event: Event, option: KeyMapAction) {
		const key = (event.target as HTMLSelectElement).value as KeyMapAction
		this._keysStore.dispatch.updateKeyMap({ [option]: key })
	}
}
