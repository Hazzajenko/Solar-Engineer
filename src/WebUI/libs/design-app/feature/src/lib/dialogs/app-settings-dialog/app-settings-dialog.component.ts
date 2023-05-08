import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { Component, ElementRef, inject, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { UiStoreService } from '@design-app/data-access'
import { LetModule } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'

import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { GraphicsMenuComponent } from './index'

@Component({
	selector: 'dialog-app-settings',
	templateUrl: 'app-settings-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		MatDialogModule,
		MatButtonModule,
		LetModule,
		DialogBackdropTemplateComponent,
		GraphicsMenuComponent,
		NgStyle,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
	],
})
export class AppSettingsDialogComponent {
	private _uiStore = inject(UiStoreService)
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
	}
}
