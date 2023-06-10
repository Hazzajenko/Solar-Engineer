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
import { ShowSvgComponent, ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { heightInOut, increaseScaleAndOpacity } from '@shared/animations'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { IsTypeOfPanelPipe } from '@entities/utils'
import { injectAuthStore } from '@auth/data-access'

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
	],
	animations: [heightInOut, increaseScaleAndOpacity],
})
export class SignInDialogComponent {
	private _uiStore = inject(UiStoreService)
	private _auth = injectAuthStore()

	user = this._auth.select.user

	constructor() {
		effect(() => {
			if (this.user()) {
				this.closeDialog()
			}
		})
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
		this._auth.dispatch.signInAsGuest()
		this.closeDialog()
	}
}
