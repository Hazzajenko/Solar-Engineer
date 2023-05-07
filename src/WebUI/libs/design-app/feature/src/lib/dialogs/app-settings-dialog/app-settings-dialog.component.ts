import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { Component, ElementRef, inject, Input, NgZone, Renderer2, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import {
	AppNgrxStateStoreV2Service,
	EntityNgrxStoreService,
	RenderService,
	SelectedStoreService,
} from '@design-app/data-access'
import { LetModule } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { CanvasGraphicsMenuComponent } from '../../menus'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'

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
		CanvasGraphicsMenuComponent,
		NgStyle,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
	],
})
export class AppSettingsDialogComponent {
	private _elementRef = inject(ElementRef<HTMLDivElement>)
	private _entities = inject(EntityNgrxStoreService)
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _selectedStore = inject(SelectedStoreService)
	private _render = inject(RenderService)
	private _appStore = inject(AppNgrxStateStoreV2Service)
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>
	dialogId!: string

	@Input({ required: true }) set data(data: { dialogId: string }) {
		this.dialogId = data.dialogId
	}

	closeDialog() {
		this._appStore.dispatch.updateDialog({ id: this.dialogId, changes: { open: false } })
	}

	// protected readonly strings = strings
}
