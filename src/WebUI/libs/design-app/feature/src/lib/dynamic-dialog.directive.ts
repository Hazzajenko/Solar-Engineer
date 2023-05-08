import { MovePanelsToStringDialogComponent } from './dialogs'
import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { DIALOG_COMPONENT, DialogInput } from '@design-app/data-access'
import { AppSettingsDialogComponent } from './dialogs/app-settings-dialog/app-settings-dialog.component'

@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	dialogRef?: ComponentRef<unknown>

	@Input() set dialog(dialog: DialogInput) {
		if (!dialog) {
			this.dialogRef?.destroy()
			return
		}
		this._viewContainerRef.clear()
		this.dialogRef = this.componentSwitch(dialog)
	}

	private componentSwitch(dialog: DialogInput) {
		switch (dialog.component) {
			case DIALOG_COMPONENT.MOVE_PANELS_TO_STRING:
				return (() => {
					const ref = this._viewContainerRef.createComponent<MovePanelsToStringDialogComponent>(
						MovePanelsToStringDialogComponent,
					)
					ref.instance.data = dialog.data
					return ref
				})()
			case DIALOG_COMPONENT.APP_SETTINGS:
				return (() => {
					return this._viewContainerRef.createComponent<AppSettingsDialogComponent>(
						AppSettingsDialogComponent,
					)
				})()
			default:
				return (() => {
					throw new Error('Invalid dialog component')
				})()
		}
	}

	ngOnDestroy(): void {
		this.dialogRef?.destroy()
	}
}
