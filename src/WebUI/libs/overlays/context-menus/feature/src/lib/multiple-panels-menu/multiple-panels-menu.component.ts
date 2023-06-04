import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { EntityStoreService } from '@entities/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuMultiplePanelsMenu,
	DIALOG_COMPONENT,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'
import { PanelId } from '@entities/shared'

@Component({
	selector: 'app-multiple-panels-menu',
	standalone: true,
	imports: [NgIf, ShowSvgComponent, ContextMenuTemplateComponent, ContextMenuDirective],
	templateUrl: './multiple-panels-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiplePanelsMenuComponent implements OnInit {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	id = CONTEXT_MENU_COMPONENT.MULTIPLE_PANELS_MENU

	contextMenu = inject(Injector).get(
		contextMenuInputInjectionToken,
	) as ContextMenuMultiplePanelsMenu

	panelIds: PanelId[] = []

	ngOnInit() {
		if (this.contextMenu.data.panelIds.length < 1) {
			console.error('No panel ids')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		this.panelIds = this.contextMenu.data.panelIds
	}

	// menuPosition!: Point

	/*	@Input({ required: true }) set location(location: Point) {
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
	 }*/

	movePanelsToString() {
		this._uiStore.dispatch.openDialog({
			// component: DIALOG_COMPONENT_TYPE.MOVE_PANELS_TO_STRING,
			component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING,
			data: {
				panelIds: this.panelIds,
			},
		})
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}

	deletePanels() {
		this._entityStore.panels.deleteManyPanels(this.panelIds)
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}
}
