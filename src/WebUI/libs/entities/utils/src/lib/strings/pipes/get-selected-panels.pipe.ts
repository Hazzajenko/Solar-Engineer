import { inject, Pipe, PipeTransform } from '@angular/core'
import { RenderService } from '@canvas/rendering/data-access'
import { AppStateStoreService } from '@canvas/app/data-access'
import { DIALOG_COMPONENT, DialogInput, UiStoreService } from '@overlays/ui-store/data-access'
import {
	ContextMenuType,
	isMultipleEntitiesContextMenuTemplate,
} from '@canvas/view-positioning/data-access'
import { EntityStoreService } from '@entities/data-access'

@Pipe({
	name: 'getSelectedPanels',
	standalone: true,
})
export class GetSelectedPanelsPipe implements PipeTransform {
	private _entities = inject(EntityStoreService)
	private _render = inject(RenderService)
	private _appStore = inject(AppStateStoreService)
	private _uiStore = inject(UiStoreService)

	// private _dialogsStore = inject(DialogsStoreService)

	transform(menu: ContextMenuType | undefined) {
		if (!menu) return
		if (!isMultipleEntitiesContextMenuTemplate(menu)) return
		return {
			panelIds: menu.ids,
			movePanelsToString: () => {
				/*			this._dialogs.open(MovePanelsToStringComponent, {
				 panelIds: menu.ids,
				 })*/
				const dialogInput: DialogInput = {
					// id: getGuid(),
					component: DIALOG_COMPONENT.MOVE_PANELS_TO_STRING, // open: true, // component: MovePanelsToStringV4Component,
					data: {
						panelIds: menu.ids,
					},
				}
				// this._appStore.dispatch.addDialog(dialogInput)
				this._uiStore.dispatch.openDialog(dialogInput)
				// this._dialogsStore.dispatch.addDialog(dialogInput)
				// this._appStore.dispatch.toggleDialog()
				this._render.renderCanvasApp()
				this._uiStore.dispatch.closeContextMenu()
				// this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
			deletePanels: () => {
				this._entities.panels.deleteManyPanels(menu.ids)
				// this._entities.panels.dispatch.deleteManyPanels(menu.ids)
				this._render.renderCanvasApp()
				this._uiStore.dispatch.closeContextMenu()
				// this._appStore.dispatch.setContextMenuState('NoContextMenu')
				return
			},
		}
	}
}
