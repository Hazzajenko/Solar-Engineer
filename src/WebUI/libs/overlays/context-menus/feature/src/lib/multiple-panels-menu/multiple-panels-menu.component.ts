import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import {
	DIALOG_COMPONENT,
	EntityStoreService,
	RenderService,
	UiStoreService,
} from '@design-app/data-access'
import { Point } from '@shared/data-access/models'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'

@Component({
	selector: 'app-multiple-panels-menu',
	standalone: true,
	imports: [NgIf, ShowSvgComponent, ContextMenuTemplateComponent],
	templateUrl: './multiple-panels-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiplePanelsMenuComponent {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	panelIds: string[] = []
	menuPosition!: Point

	@Input({ required: true }) set location(location: Point) {
		if (!location) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			console.error('no location')
			return
		}
		this.menuPosition = location
	}

	@Input({ required: true }) set data(data: { panelIds: string[] }) {
		if (data.panelIds.length < 1) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		this.panelIds = data.panelIds
	}

	movePanelsToString() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING,
			data: {
				panelIds: this.panelIds,
			},
		})
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}

	deletePanels() {
		this._entityStore.panels.dispatch.deleteManyPanels(this.panelIds)
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}
}
