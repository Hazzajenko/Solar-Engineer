import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { DialogInputWarningTemplate, injectUiStore } from '@overlays/ui-store/data-access'
import { dialogInputInjectionToken } from '../../dialog-renderer'
import { DialogBackdropTemplateComponent } from '../../dialog-backdrop-template/dialog-backdrop-template.component'
import { NgIf } from '@angular/common'

@Component({
	selector: 'dialog-warning-template',
	standalone: true,
	imports: [DialogBackdropTemplateComponent, NgIf],
	templateUrl: './dialog-warning-template.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogWarningTemplateComponent {
	private _uiStore = injectUiStore()
	private _dialog = inject(Injector).get(dialogInputInjectionToken) as DialogInputWarningTemplate
	title = this._dialog.data.title
	message = this._dialog.data.message
	buttonText = this._dialog.data.buttonText
	buttonAction = () => {
		this._dialog.data.buttonAction()
		this._uiStore.dispatch.closeDialog()
	}
}
