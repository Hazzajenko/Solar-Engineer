import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AsyncPipe, NgForOf, UpperCasePipe } from '@angular/common'
import { StringManipulatePipe } from '@shared/pipes'
import { Key, KEYS } from '@shared/data-access/models'
import { toSignal } from '@angular/core/rxjs-interop'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PushPipe } from '@ngrx/component'
import { KEY_MAP_ACTION, KeyMapAction, KeysStoreService } from '@canvas/keys/data-access'

@Component({
	selector: 'app-key-map-settings',
	standalone: true,
	imports: [
		NgForOf,
		StringManipulatePipe,
		ReactiveFormsModule,
		FormsModule,
		PushPipe,
		AsyncPipe,
		UpperCasePipe,
	],
	templateUrl: './key-map-settings.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyMapSettingsComponent {
	private _keysStore = inject(KeysStoreService)
	keyMap$ = this._keysStore.keyMap$
	private _keyMap = toSignal(this._keysStore.keyMap$, { initialValue: this._keysStore.keyMap })
	private _formBuilder = inject(FormBuilder)

	/*	keyMapForm2 = this._formBuilder.group({
	 key: ['', [Validators.required]],
	 })
	 // {key: (string | ((control: AbstractControl) => (ValidationErrors | null))[])[]}
	 keyMapForm = this._formBuilder.group(
	 (() => {
	 const group: (string | ((control: AbstractControl) => ValidationErrors | null)[])[] = []
	 for (const action of this.keyMapActions) {
	 const val = this.keyMap[action]
	 group.push(val, [Validators.required])
	 }
	 return group
	 })(),
	 )*/

	constructor() {
		console.log('keyMap', this.keyMap)
	}

	get keyMap() {
		return this._keyMap()
	}

	// keyMap = this._keysStore.keyMap
	keyMapActions = Object.values(KEY_MAP_ACTION) as KeyMapAction[]
	keyMapKeys = Object.values(KEYS) as Key[]

	changeKey(event: Event, option: KeyMapAction) {
		const key = (event.target as HTMLSelectElement).value as KeyMapAction
		this._keysStore.dispatch.updateKeyMap({ [option]: key })
	}
}
