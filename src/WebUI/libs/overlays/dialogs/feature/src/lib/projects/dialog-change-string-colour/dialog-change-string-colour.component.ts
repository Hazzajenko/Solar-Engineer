import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { injectStringsStore } from '@entities/data-access'
import { DialogInputChangeStringColour, injectUiStore } from '@overlays/ui-store/data-access'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import {
	TAILWIND_COLOUR_500,
	TAILWIND_COLOUR_500_VALUES,
	TailwindColor500,
} from '@shared/data-access/models'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import { assertNotNull } from '@shared/utils'
import { InputSvgComponent } from '@shared/ui'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { LetDirective } from '@ngrx/component'

@Component({
	selector: 'dialog-change-string-colour',
	standalone: true,
	imports: [
		DialogBackdropTemplateComponent,
		NgIf,
		NgForOf,
		NgClass,
		NgStyle,
		InputSvgComponent,
		ReactiveFormsModule,
		LetDirective,
	],
	templateUrl: './dialog-change-string-colour.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogChangeStringColourComponent implements OnInit {
	private _fb = inject(FormBuilder)
	private _stringsStore = injectStringsStore()
	private _uiStore = injectUiStore()

	currentDialog = this._uiStore.select.currentDialog

	dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputChangeStringColour

	string = this._stringsStore.select.selectById(this.dialog.data.stringId)
	changeColourForm = this._fb.group({
		colour: [TAILWIND_COLOUR_500.blue as TailwindColor500, [Validators.required]],
	})
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES

	ngOnInit() {
		const string = this.string()
		assertNotNull(string)
		this.changeColourForm.patchValue({
			colour: string.colour as TailwindColor500,
		})
	}

	setColour(colour: TailwindColor500) {
		this.changeColourForm.get('colour')?.setValue(colour)
	}

	onSubmit() {
		if (!this.changeColourForm.valid) {
			console.error('Invalid Form')
			return
		}

		const colour = this.changeColourForm.get('colour')?.value

		if (!colour) {
			throw new Error('Colour is undefined')
		}

		const string = this.string()
		assertNotNull(string)
		this._stringsStore.dispatch.updateString({
			id: string.id,
			changes: {
				colour,
			},
		})
		this._uiStore.dispatch.closeDialog()
	}
}
