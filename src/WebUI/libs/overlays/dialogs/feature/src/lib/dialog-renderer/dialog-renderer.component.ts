import {
	ChangeDetectionStrategy,
	Component,
	effect,
	inject,
	InjectionToken,
	Injector,
	OnDestroy,
} from '@angular/core'
import { DIALOG_COMPONENT, DialogInput, injectUiStore } from '@overlays/ui-store/data-access'
import { NgComponentOutlet, NgIf } from '@angular/common'
import { AppSettingsDialogComponent } from '../app-settings-dialog'
import { MovePanelsToStringDialogComponent } from '../move-panels-to-string-dialog/move-panels-to-string-dialog.component'
import { ProfileSettingsDialogComponent } from '../profile-settings-dialog/profile-settings-dialog.component'
import { SignInDialogComponent } from '../sign-in-dialog/sign-in-dialog.component'
import { DialogCreateProjectComponent } from '../dialog-create-project'
import { handleAllSwitchCases } from '@shared/utils'
import { DialogDeleteProjectWarningComponent } from '../dialog-delete-project-warning'

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
	dialogInjector: Injector | undefined
	component: ReturnType<typeof this.switchFn> | undefined

	constructor() {
		effect(() => {
			if (!this.dialog) {
				return
			}

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
			case DIALOG_COMPONENT.DELETE_PROJECT_WARNING:
				return DialogDeleteProjectWarningComponent
			default:
				return handleAllSwitchCases(component)
		}
	}
}
