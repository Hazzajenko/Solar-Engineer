import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
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
import { injectEntityStore } from '@entities/data-access'
import { scaleAndOpacityAnimation } from '@shared/animations'
import { ContextMenuBaseComponent, ContextMenuItemComponent } from '../context-menu-builder'

@Component({
	selector: 'app-multiple-panels-menu',
	standalone: true,
	imports: [
		NgIf,
		ShowSvgComponent,
		ContextMenuTemplateComponent,
		ContextMenuDirective,
		ContextMenuBaseComponent,
		ContextMenuItemComponent,
	],
	templateUrl: './multiple-panels-menu.component.html',
	styles: [],
	animations: [scaleAndOpacityAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiplePanelsMenuComponent implements OnInit {
	private _entityStore = injectEntityStore()
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

	movePanelsToString() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING,
			data: {
				panelIds: this.panelIds,
			},
		})
		this._uiStore.dispatch.closeContextMenu()
	}

	deletePanels() {
		this._entityStore.panels.dispatch.deleteManyPanels(this.panelIds)
		this._uiStore.dispatch.closeContextMenu()
	}
}
