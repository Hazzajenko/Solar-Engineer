import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgIf } from '@angular/common'

export type DialogWarningTemplateInput = {
	title: string
	message: string
	buttonText: string
	buttonAction: () => void
}

@Component({
	selector: 'dialog-warning-template-input',
	standalone: true,
	imports: [DialogBackdropTemplateComponent, NgIf],
	templateUrl: './dialog-warning-template-inputs.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWarningTemplateInputsComponent {
	@Input({ required: true }) data!: DialogWarningTemplateInput
	@Output() closeDialog = new EventEmitter<void>()

	buttonAction = () => {
		this.data.buttonAction()
		this.closeDialog.emit()
	}
}
