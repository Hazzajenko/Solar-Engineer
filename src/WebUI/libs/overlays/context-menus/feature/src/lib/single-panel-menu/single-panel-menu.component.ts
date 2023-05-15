import { ChangeDetectionStrategy, Component, inject, Injector, OnInit } from '@angular/core'
import { JsonPipe, NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { EntityStoreService } from '@entities/data-access'
import { RenderService } from '@canvas/rendering/data-access'
import { ContextMenuSinglePanelMenu, UiStoreService } from '@overlays/ui-store/data-access'
import { CanvasPanel, CanvasString } from '@entities/shared'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { ContextMenuDirective } from '../directives'

@Component({
	selector: 'app-single-panel-menu',
	standalone: true,
	imports: [NgIf, ShowSvgComponent, ContextMenuTemplateComponent, ContextMenuDirective, JsonPipe],
	templateUrl: './single-panel-menu.component.html',
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePanelMenuComponent implements OnInit {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuSinglePanelMenu

	panel!: CanvasPanel
	string: CanvasString | undefined

	ngOnInit() {
		const panel = this._entityStore.panels.getById(this.contextMenu.data.panelId)
		if (!panel) {
			console.error('No panel')
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		this.panel = panel
		this.string = this._entityStore.strings.getById(panel.stringId)
	}

	deletePanel() {
		this._entityStore.panels.deletePanel(this.panel.id)
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}
}
