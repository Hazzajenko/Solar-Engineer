import { inject, Pipe, PipeTransform } from '@angular/core'
import { CanvasEntity } from '@shared/data-access/models'
import { RenderService } from '@canvas/rendering/data-access'
import { UiStoreService } from '@overlays/ui-store/data-access'
import {
	ContextMenuType,
	isSingleEntityContextMenuTemplate,
} from '@canvas/view-positioning/data-access'
import { isPanel } from '@entities/panels/data-access'
import { CanvasString } from '../types'
import { injectEntityStore } from '@entities/common/data-access'

export type PanelWithString = CanvasEntity & {
	string: CanvasString | undefined
}

@Pipe({
	name: 'getPanelWithString',
	standalone: true,
})
export class GetPanelWithStringPipe implements PipeTransform {
	private _entities = injectEntityStore()
	// private _entities = inject(EntityStoreService)
	private _render = inject(RenderService)
	// private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)

	// private _entities = inject(EntityStoreService)

	transform(menu: ContextMenuType | undefined) {
		// transform(menu: ContextMenuType | undefined): PanelWithString | undefined {
		if (!menu) return
		if (!isSingleEntityContextMenuTemplate(menu)) return
		const entity = this._entities.panels.getById(menu.id)
		if (!entity) return
		if (!isPanel(entity)) return
		const string = this._entities.strings.getById(entity.stringId)
		return {
			...entity,
			string,
			deletePanel: () => {
				this._entities.panels.deletePanel(entity.id)
				// this._entities.panels.dispatch.deletePanel(entity.id)
				this._render.renderCanvasApp()
				this._uiStore.dispatch.closeContextMenu()
				// this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
		}
	}
}
