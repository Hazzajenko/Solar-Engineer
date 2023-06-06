import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { Component, ElementRef, inject, Input, NgZone, Renderer2, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'
import { LetDirective } from '@ngrx/component'
import { DialogBackdropTemplateComponent } from '../dialog-backdrop-template/dialog-backdrop-template.component'
import { injectEntityStore } from '@entities/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { AppStateStoreService } from '@canvas/app/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import { createStringWithPanelsV2 } from '@entities/utils'

@Component({
	selector: 'dialog-move-panels-to-string',
	templateUrl: 'move-panels-to-string-dialog.component.html',
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
		MatDialogModule,
		MatButtonModule,
		LetDirective,
		DialogBackdropTemplateComponent,
	],
})
export class MovePanelsToStringDialogComponent {
	private _elementRef = inject(ElementRef<HTMLDivElement>)
	private _entities = injectEntityStore()
	private _renderer = inject(Renderer2)
	private _ngZone = inject(NgZone)
	private _selectedStore = injectSelectedStore()
	private _render = inject(RenderService)
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)
	@ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>
	@ViewChild('dialog') dialog!: ElementRef<HTMLDivElement>
	strings = this._entities.strings.select.allStrings
	// strings = toSignal(this._entities.strings.select.allStrings()WithPanels$)
	// dialogId!: string
	panelIds!: string[]

	@Input({ required: true }) set data(data: { panelIds: string[] }) {
		console.log('panelIds', data)
		// this.dialogId = data.dialogId
		this.panelIds = data.panelIds
	}

	createStringWithSelected() {
		const multipleSelectedIds = this._selectedStore.select.multipleSelectedPanelIds()
		if (multipleSelectedIds.length < 1) {
			throw new Error('multipleSelectedIds.length < 1')
		}
		const amountOfStrings = this._entities.strings.select.allStrings().length
		const { string, panelUpdates } = createStringWithPanelsV2(multipleSelectedIds, amountOfStrings)
		this._entities.strings.dispatch.addString(string)
		this._entities.panels.dispatch.updateManyPanels(panelUpdates)
		this._selectedStore.dispatch.selectStringId(string.id)
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeDialog()
		// this._appStore.dispatch.updateDialog({ id: this.dialogId, changes: { open: false } })
	}

	closeDialog() {
		this._uiStore.dispatch.closeDialog()
		// this._uiStore.dispatch.updateDialog({ id: this.dialogId, changes: { open: false } })
		// this._appStore.dispatch.updateDialog({ id: this.dialogId, changes: { open: false } })
	}
}
