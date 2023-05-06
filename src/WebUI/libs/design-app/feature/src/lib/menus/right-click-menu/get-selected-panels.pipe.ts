import { inject, Pipe, PipeTransform } from '@angular/core'
import {
	AppNgrxStateStoreV2Service,
	ContextMenuType,
	DialogsService,
	EntityNgrxStoreService,
	isMultipleEntitiesContextMenuTemplate,
	RenderService,
} from '@design-app/data-access'


@Pipe({
	name: 'getSelectedPanels',
	standalone: true,
})
export class GetSelectedPanelsPipe implements PipeTransform {
	private _entities = inject(EntityNgrxStoreService)
	private _render = inject(RenderService)
	private _appStore = inject(AppNgrxStateStoreV2Service)
	private _dialogs = inject(DialogsService)

	transform(menu: ContextMenuType | undefined) {
		if (!menu) return
		if (!isMultipleEntitiesContextMenuTemplate(menu)) return
		return {
			panelIds: menu.ids,
			movePanelsToString: () => {
				/*			this._dialogs.open(MovePanelsToStringComponent, {
				 panelIds: menu.ids,
				 })*/
				this._appStore.dispatch.toggleDialog()
				this._render.renderCanvasApp()
				this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
			deletePanels: () => {
				this._entities.panels.dispatch.deleteManyPanels(menu.ids)
				this._render.renderCanvasApp()
				this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
		}
	}
}