import { AppSettingsDialogComponent, MovePanelsToStringDialogComponent } from '../dialogs'
import {
	ComponentRef,
	Directive,
	effect,
	inject,
	NgZone,
	OnDestroy,
	Renderer2,
	ViewContainerRef,
} from '@angular/core'
import { DIALOG_COMPONENT, DialogInput, UiStoreService } from '@design-app/data-access'
import { toSignal } from '@angular/core/rxjs-interop'

@Directive({
	selector: '[appDynamicDialog]',
	standalone: true,
})
export class DynamicDialogDirective implements OnDestroy {
	private _viewContainerRef = inject(ViewContainerRef)
	private _uiStore = inject(UiStoreService)
	private _dialog = toSignal(this._uiStore.dialog$, {
		initialValue: this._uiStore.dialog,
	})
	private _ngZone = inject(NgZone)
	private renderer = inject(Renderer2)
	private _killEvent?: () => void
	dialogRef?: ComponentRef<unknown>

	get dialog() {
		return this._dialog()
	}

	constructor() {
		effect(() => {
			if (!this.dialog || !this.dialog.currentDialog || !this.dialog.dialogOpen) {
				this.dialogRef?.destroy()
				return
			}
			this._viewContainerRef.clear()
			this.dialogRef = this.componentSwitch(this.dialog.currentDialog)
			this._ngZone.runOutsideAngular(() => {
				this._killEvent = this.renderer.listen('document', 'click', (event: MouseEvent) => {
					if (!this.dialogRef) {
						this.ngOnDestroy()
						return
					}
					if (event.target instanceof Node && this.dialogRef.location) {
						if (this.dialogRef.location.nativeElement.contains(event.target)) return
					}
					this.ngOnDestroy()
				})
			})
		})
	}

	/*	@Input() set dialog(dialog: DialogInput) {
	 if (!dialog) {
	 this.dialogRef?.destroy()
	 return
	 }
	 this._viewContainerRef.clear()
	 this.dialogRef = this.componentSwitch(dialog)
	 }*/

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
		this._killEvent?.()
		this.dialogRef?.destroy()
		this._uiStore.dispatch.closeDialog()
	}
}
