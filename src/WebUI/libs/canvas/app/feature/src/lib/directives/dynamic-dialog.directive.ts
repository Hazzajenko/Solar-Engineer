import {
	AppSettingsDialogComponent,
	MovePanelsToStringDialogComponent,
	ProfileSettingsDialogComponent,
} from '@overlays/dialogs/feature'
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
import { toSignal } from '@angular/core/rxjs-interop'
import { DIALOG_COMPONENT, DialogInput, UiStoreService } from '@overlays/ui-store/data-access'

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

	get dialog() {
		return this._dialog()
	}

	/*	@Input() set dialog(dialog: DialogInput) {
	 if (!dialog) {
	 this.dialogRef?.destroy()
	 return
	 }
	 this._viewContainerRef.clear()
	 this.dialogRef = this.componentSwitch(dialog)
	 }*/

	ngOnDestroy(): void {
		this._killEvent?.()
		this.dialogRef?.destroy()
		this._uiStore.dispatch.closeDialog()
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
			case DIALOG_COMPONENT.PROFILE_SETTINGS:
				return (() => {
					return this._viewContainerRef.createComponent<ProfileSettingsDialogComponent>(
						ProfileSettingsDialogComponent,
					)
				})()
			default:
				return (() => {
					throw new Error('Invalid dialog component')
				})()
		}
	}
}
