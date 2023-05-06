import { MovePanelsToStringV2Component } from './dialogs/move-panels-to-string-v2/move-panels-to-string-v2.component'
import { MovePanelsToStringV3Component } from './dialogs/move-panels-to-string-v3/move-panels-to-string-v3.component'
import { MovePanelsToStringV4Component } from './dialogs/move-panels-to-string-v4/move-panels-to-string-v4.component'
import {
	ComponentRef,
	Directive,
	inject,
	Input,
	NgZone,
	OnDestroy,
	ViewContainerRef,
} from '@angular/core'
import { DialogInput } from '@design-app/data-access'


@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	private _ngZone = inject(NgZone)

	private _dialogInputs: DialogInput<any>[] = []

	testModelRef?: ComponentRef<MovePanelsToStringV2Component>
	testModelRef2?: ComponentRef<MovePanelsToStringV3Component>
	testModelRef3?: ComponentRef<MovePanelsToStringV4Component>

	/*  ngAfterViewInit(): void {
	 this.cdr.detach()
	 }*/

	/*	@Input() set dialog<T>(dialog: {
	 component: ComponentType<T>
	 data?: unknown
	 options?: DialogOptions
	 }) {*/
	@Input() set dialogs(dialogs: DialogInput<any>[]) {
		this._dialogInputs =
			this._dialogInputs.length < 1 ? dialogs : [...this._dialogInputs, ...dialogs]
		// this._dialogInputs = this._dialogInputs.length < 1 ? [dialogs] : [...this._dialogInputs, dialogs]
		dialogs.forEach((dialog) => {
			this._ngZone.run(() => {
				const _viewContainerRef = this._viewContainerRef
				_viewContainerRef.clear()
				const ref = _viewContainerRef.createComponent(dialog.component)
				ref.instance.data = dialog.data

				/*				_viewContainerRef.createComponent<MovePanelsToStringV2Component>(
				 MovePanelsToStringV2Component,
				 )
				 _viewContainerRef.createComponent<MovePanelsToStringV3Component>(
				 MovePanelsToStringV3Component,
				 )
				 _viewContainerRef.createComponent<MovePanelsToStringV4Component>(
				 MovePanelsToStringV4Component,
				 )*/
			})
		})
	}

	@Input() set dialog(dialog: boolean) {
		const _viewContainerRef = this._viewContainerRef

		_viewContainerRef.clear()
		/*		this.testModelRef = _viewContainerRef.createComponent<MovePanelsToStringV2Component>(
		 MovePanelsToStringV2Component,
		 )*/
		/*		this.testModelRef2 = _viewContainerRef.createComponent<MovePanelsToStringV3Component>(
		 MovePanelsToStringV3Component,
		 )*/
		this.testModelRef3 = _viewContainerRef.createComponent<MovePanelsToStringV4Component>(
			MovePanelsToStringV4Component,
		)
		this.testModelRef3.setInput('panelIds', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
	}

	ngOnDestroy(): void {
		this.testModelRef?.destroy()
	}
}