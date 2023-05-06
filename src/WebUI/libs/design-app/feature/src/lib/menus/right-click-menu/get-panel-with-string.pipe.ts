import { inject, Pipe, PipeTransform } from '@angular/core'
import {
	AppNgrxStateStoreV2Service,
	ContextMenuType,
	EntityNgrxStoreService,
	isSingleEntityContextMenuTemplate,
	RenderService,
} from '@design-app/data-access'
import { CanvasEntity, CanvasString } from '@design-app/shared'
import { isPanel } from '@design-app/utils'

export type PanelWithString = CanvasEntity & {
	string: CanvasString | undefined
}

@Pipe({
	name: 'getPanelWithString',
	standalone: true,
})
export class GetPanelWithStringPipe implements PipeTransform {
	private _entities = inject(EntityNgrxStoreService)
	private _render = inject(RenderService)
	private _appStore = inject(AppNgrxStateStoreV2Service)

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
				this._entities.panels.dispatch.deletePanel(entity.id)
				this._render.renderCanvasApp()
				this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
		}
	}
}