import {
	AsyncPipe,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { Component, effect, inject } from '@angular/core'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import {
	InputSvgComponent,
	ShowSvgComponent,
	ShowSvgNoStylesComponent,
	ToggleSvgNoStylesComponent,
} from '@shared/ui'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { IsTypeOfPanelPipe } from '@entities/utils'
import { injectAuthStore } from '@auth/data-access'
import { ProjectsLocalStorageService } from '@entities/data-access'

@Component({
	selector: 'dialog-sign-in',
	templateUrl: './sign-in-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		LetDirective,
		DialogBackdropTemplateComponent,
		NgStyle,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		CdkDrag,
		CdkDragHandle,
		IsTypeOfPanelPipe,
		RadiansToDegreesPipe,
		TruncatePipe,
		NgTemplateOutlet,
		ToggleSvgNoStylesComponent,
		NgOptimizedImage,
		InputSvgComponent,
	],
})
export class SignInDialogComponent {
	private _uiStore = inject(UiStoreService)
	private _auth = injectAuthStore()
	private _projectsLocalStorage = inject(ProjectsLocalStorageService)

	user = this._auth.select.user

	constructor() {
		effect(
			() => {
				if (this.user()) {
					this.closeDialog()
				}
			},
			{ allowSignalWrites: true },
		)
	}

	signInWithGoogle() {
		this._auth.dispatch.signInWithGoogle()
	}

	signInWithGithub() {
		this._auth.dispatch.signInWithGithub()
	}

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}

	signInAsGuest() {
		/*		if (!this._projectsLocalStorage.isProjectExisting()) {
		 this.closeDialog()
		 this._uiStore.dispatch.openDialog({
		 component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
		 })
		 return
		 }*/
		this._auth.dispatch.signInAsGuest()

		this.closeDialog()
	}

	signInWithMicrosoft() {
		this._auth.dispatch.signInWithMicrosoft()
	}
}
