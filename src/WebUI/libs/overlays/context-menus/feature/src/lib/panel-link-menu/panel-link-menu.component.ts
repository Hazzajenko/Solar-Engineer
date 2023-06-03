import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { ContextMenuDirective } from '../directives'
import { EntityStoreService } from '@entities/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import {
	CONTEXT_MENU_COMPONENT,
	ContextMenuPanelLinkMenu,
	UiStoreService,
} from '@overlays/ui-store/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { PanelLinkModel } from '@entities/shared'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { NgIf } from '@angular/common'
import { AppStateStoreService } from '@canvas/app/data-access'

@Component({
	selector: 'app-panel-link-menu',
	standalone: true,
	imports: [ContextMenuDirective, ShowSvgComponent, NgIf, ShowSvgNoStylesComponent],
	templateUrl: './panel-link-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelLinkMenuComponent implements OnInit {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)
	private _appStore = inject(AppStateStoreService)

	id = CONTEXT_MENU_COMPONENT.PANEL_LINK_MENU

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuPanelLinkMenu

	panelLink!: PanelLinkModel

	ngOnInit() {
		const panelLink = this._entityStore.panelLinks.getById(this.contextMenu.data.panelLinkId)
		if (!panelLink) {
			console.error('Panel link not found')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}

		this.panelLink = panelLink
	}

	enterPolarityPanel(event: PointerEvent, panelId: string) {
		// this._appStore.dispatch.setHoveringOverEntityState(panelId)
		this._entityStore.panelLinks.setHoveringOverPanelInLinkMenuId(panelId)
	}

	leavePolarityPanel() {
		this._entityStore.panelLinks.clearHoveringOverPanelInLinkMenuId()
		// this._appStore.dispatch.liftHoveringOverEntity()
	}

	deletePanelLink() {
		this._entityStore.panelLinks.deletePanelLink(this.panelLink.id)
		this._uiStore.dispatch.closeContextMenu()
	}
}
