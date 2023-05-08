import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { GetStringWithPanelIdsPipe } from '@design-app/feature'
import { NgIf } from '@angular/common'
import { ShowSvgComponent } from '@shared/ui'
import { CanvasString } from '@design-app/shared'
import { EntityStoreService, RenderService, UiStoreService } from '@design-app/data-access'
import { ContextMenuTemplateComponent } from '../context-menu-template/context-menu-template.component'
import { Point } from '@shared/data-access/models'

@Component({
	selector: 'app-string-menu',
	standalone: true,
	imports: [GetStringWithPanelIdsPipe, NgIf, ShowSvgComponent, ContextMenuTemplateComponent],
	templateUrl: './string-menu.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringMenuComponent {
	private _entityStore = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _uiStore = inject(UiStoreService)

	string!: CanvasString
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

	@Input({ required: true }) set data(data: { stringId: string }) {
		if (!data.stringId) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			console.error('String id not found')
			return
		}
		const string = this._entityStore.strings.getById(data.stringId)
		if (!string) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			console.error('String not found')
			return
		}
		const panelIds = this._entityStore.panels.getByStringId(string.id).map((panel) => panel.id)
		if (!panelIds.length) {
			this._render.renderCanvasApp()
			this._uiStore.dispatch.closeContextMenu()
			console.error('String has no panels')
			return
		}
		this.string = string
		this.panelIds = panelIds
	}
}
