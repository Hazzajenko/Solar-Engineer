import { MovePanelsToStringV2Component } from './dialogs/move-panels-to-string-v2/move-panels-to-string-v2.component'
import {
	ComponentRef,
	Directive,
	inject,
	Input,
	NgZone,
	OnDestroy,
	ViewContainerRef,
} from '@angular/core'


@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	private _ngZone = inject(NgZone)

	testModelRef?: ComponentRef<MovePanelsToStringV2Component>

	/*  ngAfterViewInit(): void {
	 this.cdr.detach()
	 }*/

	/*	@Input() set dialog<T>(dialog: {
	 component: ComponentType<T>
	 data?: unknown
	 options?: DialogOptions
	 }) {*/
	@Input() set dialog(dialog: boolean) {
		const _viewContainerRef = this._viewContainerRef

		_viewContainerRef.clear()
		this.testModelRef = _viewContainerRef.createComponent<MovePanelsToStringV2Component>(
			MovePanelsToStringV2Component,
		)
	}

	ngOnDestroy(): void {
		this.testModelRef?.destroy()
	}
}