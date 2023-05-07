import { MovePanelsToStringV4Component } from './dialogs/move-panels-to-string-v4/move-panels-to-string-v4.component'
import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { DIALOG_COMPONENT, DialogInput, isDialogMovePanelsToString } from '@design-app/data-access'
import { AppSettingsDialogComponent } from './dialogs'

@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	movePanelsToStringRef?: ComponentRef<MovePanelsToStringV4Component>
	dialogRef?: ComponentRef<unknown>

	@Input() set dialog(dialog: DialogInput) {
		if (!dialog.open) {
			this.movePanelsToStringRef?.destroy()
			this.dialogRef?.destroy()
			return
		}
		const _viewContainerRef = this._viewContainerRef
		_viewContainerRef.clear()
		this.dialogRef = this.componentSwitch(dialog, _viewContainerRef)
	}

	private componentSwitch = (dialogInput: DialogInput, viewContainerRef: ViewContainerRef) => {
		return (
			{
				[DIALOG_COMPONENT.MOVE_PANELS_TO_STRING]: () => {
					const ref = viewContainerRef.createComponent<MovePanelsToStringV4Component>(
						MovePanelsToStringV4Component,
					)
					if (!isDialogMovePanelsToString(dialogInput)) {
						throw new Error('Invalid dialog data')
					}
					ref.instance.data = {
						dialogId: dialogInput.id,
						panelIds: dialogInput.data.panelIds,
					}
					return ref
				},
				[DIALOG_COMPONENT.APP_SETTINGS]: () => {
					const ref = viewContainerRef.createComponent<AppSettingsDialogComponent>(
						AppSettingsDialogComponent,
					)
					ref.instance.data = {
						dialogId: dialogInput.id,
					}
					return ref
				},
			}[dialogInput.component] ||
			(() => {
				throw new Error('Invalid dialog component')
			})
		)()
	}

	ngOnDestroy(): void {
		this.movePanelsToStringRef?.destroy()
		this.dialogRef?.destroy()
	}
}
