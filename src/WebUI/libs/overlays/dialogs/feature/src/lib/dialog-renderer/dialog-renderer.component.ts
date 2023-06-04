import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	InjectionToken,
	Injector,
	OnDestroy,
	Renderer2,
} from '@angular/core'
import { DIALOG_COMPONENT, DialogInput, injectUiStore } from '@overlays/ui-store/data-access'
import { NgComponentOutlet, NgIf } from '@angular/common'
import { AppSettingsDialogComponent } from '../app-settings-dialog'
import { MovePanelsToStringDialogComponent } from '../move-panels-to-string-dialog/move-panels-to-string-dialog.component'
import { ProfileSettingsDialogComponent } from '../profile-settings-dialog/profile-settings-dialog.component'
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component'
import { DialogCreateProjectComponent } from '../dialog-create-project'

export const dialogInputInjectionToken = new InjectionToken<DialogInput>('')

@Component({
	selector: 'app-dialog-renderer',
	standalone: true,
	imports: [NgIf, NgComponentOutlet],
	template: `
		<ng-container *ngIf="dialog && dialog.component">
			<ng-container *ngIf="component && dialogInjector">
				<ng-container *ngComponentOutlet="component; injector: dialogInjector" />
			</ng-container>
		</ng-container>
	`,
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogRendererComponent implements OnDestroy {
	private _uiStore = injectUiStore()
	private _dialog = this._uiStore.select.currentDialog
	private _injector = inject(Injector)
	private _killEvent?: () => void
	private _renderer = inject(Renderer2)

	dialogInjector: Injector | undefined

	// component: DialogInput['component'] | undefined
	component: ReturnType<typeof this.switchFn> | undefined

	// @ViewChild() ngComponentOutlet!: NgComponentOutlet

	constructor() {
		effect(() => {
			if (!this.dialog) {
				return
			}

			// this.component = this.dialog.component
			this.component = this.switchFn(this.dialog.component)

			this.dialogInjector = Injector.create({
				providers: [
					{
						provide: dialogInputInjectionToken,
						useValue: this.dialog,
					},
				],
				parent: this._injector,
			})

			// this._injector.

			/*			this._killEvent = this._renderer.listen('document', 'click', (event: MouseEvent) => {
			 if (!this.dialogInjector) {
			 this.ngOnDestroy()
			 return
			 }
			 if (event.target instanceof Node) {
			 // if (this._renderer..?.nativeElement.contains(event.target)) return
			 }
			 this.ngOnDestroy()
			 })*/
		})
	}

	get dialog(): DialogInput | undefined {
		return this._dialog()
	}

	ngOnDestroy() {
		this._killEvent?.()
		this._uiStore.dispatch.closeDialog()
	}

	private switchFn(component: DialogInput['component']) {
		switch (component) {
			case DIALOG_COMPONENT.APP_SETTINGS:
				return AppSettingsDialogComponent
			case DIALOG_COMPONENT.MOVE_PANELS_TO_STRING:
				return MovePanelsToStringDialogComponent
			case DIALOG_COMPONENT.PROFILE_SETTINGS:
				return ProfileSettingsDialogComponent
			case DIALOG_COMPONENT.SIGN_IN:
				return SignInDialogComponent
			case DIALOG_COMPONENT.CREATE_PROJECT:
				return DialogCreateProjectComponent
			default:
				return throwBadDialogInput(component)
			// throw new Error('Unknown context menu component')
		}
	}
}

// Externally-visible signature
function throwBadDialogInput(component: never): never
// Implementation signature
function throwBadDialogInput(component: DialogInput['component']) {
	throw new Error('Unknown component kind: ' + component)
}
