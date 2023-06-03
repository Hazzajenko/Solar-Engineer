import {
	AsyncPipe,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { Component, inject } from '@angular/core'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { ShowSvgComponent, ShowSvgNoStylesComponent, ToggleSvgNoStylesComponent } from '@shared/ui'
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop'
import { RadiansToDegreesPipe, TruncatePipe } from '@shared/pipes'
import { heightInOut } from '@shared/animations'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { IsTypeOfPanelPipe } from '@entities/utils'
import { injectAuthStore } from '@auth/data-access'
import { transitionContextMenu } from '../../../../../context-menus/feature/src/lib/animations/context-menu.animation'

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
	animations: [heightInOut, transitionContextMenu],
})
export class SignInDialogComponent {
	private _uiStore = inject(UiStoreService)
	private _auth = injectAuthStore()

	signInWithGoogle() {
		this._auth.dispatch.signInWithGoogle()
	}

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}
}
