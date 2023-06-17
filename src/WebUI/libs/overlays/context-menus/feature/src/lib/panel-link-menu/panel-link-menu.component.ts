import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { ContextMenuDirective } from '../directives'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuPanelLinkMenu,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { PanelId, PanelLinkModel } from '@entities/shared'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { NgIf } from '@angular/common'
import { injectEntityStore } from '@entities/data-access'
import { scaleAndOpacityAnimation } from '@shared/animations'

@Component({
	selector: 'app-panel-link-menu',
	standalone: true,
	imports: [ContextMenuDirective, ShowSvgComponent, NgIf, ShowSvgNoStylesComponent],
	templateUrl: './panel-link-menu.component.html',
	animations: [scaleAndOpacityAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLinkMenuComponent implements OnInit {
	private _entityStore = injectEntityStore()
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	id = CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuPanelLinkMenu

	panelLink!: PanelLinkModel

	ngOnInit() {
		const panelLink = this._entityStore.panelLinks.select.getById(this.contextMenu.data.panelLinkId)
		if (!panelLink) {
			console.error('Panel link not found')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}

		this.panelLink = panelLink
	}

	enterPolarityPanel(event: PointerEvent, panelId: PanelId) {
		// this._appStore.dispatch.setHoveringOverEntityState(panelId)
		this._entityStore.panelLinks.dispatch.setHoveringOverPanelInLinkMenuId(panelId)
	}

	leavePolarityPanel() {
		this._entityStore.panelLinks.dispatch.clearHoveringOverPanelInLinkMenuId()
		// this._appStore.dispatch.liftHoveringOverEntity()
	}

	deletePanelLink() {
		this._entityStore.panelLinks.dispatch.deletePanelLink(this.panelLink.id)
		this._uiStore.dispatch.closeContextMenu()
	}
}
