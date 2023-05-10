import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { CanvasPanel, CanvasString } from '@design-app/shared'
import { EntityStoreService, RenderService, UiStoreService } from '@design-app/data-access'
import { Point } from '@shared/data-access/models'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'

@Component({
	selector: 'app-single-panel-menu',
	standalone: true,
	imports: [NgIf, ShowSvgComponent, ContextMenuTemplateComponent],
	templateUrl: './single-panel-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePanelMenuComponent {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	panel!: CanvasPanel
	string: CanvasString | undefined
	menuPosition!: Point

	@Input({ required: true }) set location(location: Point) {
		console.log('location', location)
		if (!location) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			console.error('no location')
			return
		}
		this.menuPosition = location
	}

	@Input({ required: true }) set data(data: { panelId: string }) {
		console.log('data', data)
		if (!data.panelId) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		const panel = this._entityStore.panels.getById(data.panelId)
		if (!panel) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			return
		}
		const string = this._entityStore.strings.getById(panel.stringId)
		this.panel = panel
		console.log('panel', panel)
		console.log('string', string)
		this.string = string
	}

	deletePanel() {
		this._entityStore.panels.dispatch.deletePanel(this.panel.id)
		this._render.renderCanvasApp()
		this._uiStore.dispatch.closeContextMenu()
	}
}
