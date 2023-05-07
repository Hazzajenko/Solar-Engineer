import { MovePanelsToStringV4Component } from './dialogs/move-panels-to-string-v4/move-panels-to-string-v4.component'
import { ComponentRef, Directive, inject, Input, OnDestroy, ViewContainerRef } from '@angular/core'
import { DIALOG_COMPONENT, DialogInput, isDialogMovePanelsToString } from '@design-app/data-access'


@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	movePanelsToStringRef?: ComponentRef<MovePanelsToStringV4Component>
	dialogRef?: ComponentRef<unknown>

	@Input() set dialog(dialog: DialogInput) {
		const _viewContainerRef = this._viewContainerRef
		_viewContainerRef.clear()
		this.dialogRef = this.componentSwitch(dialog, _viewContainerRef)()
	}

	private componentSwitch = (dialogInput: DialogInput, viewContainerRef: ViewContainerRef) => {
		return {
			[DIALOG_COMPONENT.MOVE_PANELS_TO_STRING]: () => {
				const ref = viewContainerRef.createComponent<MovePanelsToStringV4Component>(
					MovePanelsToStringV4Component,
				)
				if (!isDialogMovePanelsToString(dialogInput)) {
					throw new Error('Invalid dialog data')
				}
				ref.instance.data = dialogInput.data
				return ref
			},
		}[dialogInput.component]
	}

	ngOnDestroy(): void {
		this.movePanelsToStringRef?.destroy()
		this.dialogRef?.destroy()
	}
}

/*
 const componentSwitch = (dialogComponent: DialogComponent) => ({
 [DIALOG_COMPONENT.MOVE_PANELS_TO_STRING]: {
 this.movePanelsToStringRef =
 this._viewContainerRef.createComponent<MovePanelsToStringV4Component>(
 MovePanelsToStringV4Component,
 )
 if (!isDialogMovePanelsToString(dialog)) {
 throw new Error('Invalid dialog data')
 }
 this.movePanelsToStringRef.instance.data = dialog.data


 },
 })[dialog.component]
 }
 }*/

/*const hub = (dialogComponent: DialogComponent, viewContainerRef: ViewContainerRef) => ({
 return (dialogComponent: DialogComponent) => ({
 [DIALOG_COMPONENT.MOVE_PANELS_TO_STRING]: {
 return 'movePanelsToStringRef'
 },
 })[dialogComponent]
 // })
 // }
 // })
 }*/
/*const componentSwitch = (dialogInput: DialogInput, viewContainerRef: ViewContainerRef) => {
 return {
 [DIALOG_COMPONENT.MOVE_PANELS_TO_STRING]: () => {
 const ref = viewContainerRef.createComponent<MovePanelsToStringV4Component>(
 MovePanelsToStringV4Component,
 )
 if (!isDialogMovePanelsToString(dialogInput)) {
 throw new Error('Invalid dialog data')
 }
 ref.instance.data = dialogInput.data
 return ref
 },
 }[dialogInput.component]
 }

 const viewContainerRef = inject(ViewContainerRef)
 const dialogInput: DialogInput = {
 id: 'movePanelsToString',
 component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING,
 data: {
 panelIds: [],
 },
 }
 const result = componentSwitch(dialogInput, viewContainerRef)*/
// result().

// }