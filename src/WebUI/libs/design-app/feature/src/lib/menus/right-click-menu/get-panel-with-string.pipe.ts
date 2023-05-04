import { inject, Pipe, PipeTransform } from '@angular/core'
import {
	ContextMenuType,
	EntityStoreService,
	isSingleEntityContextMenuTemplate,
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
	private _entities = inject(EntityStoreService)

	transform(menu: ContextMenuType): PanelWithString | undefined {
		if (!isSingleEntityContextMenuTemplate(menu)) return
		const entity = this._entities.panels.getEntityById(menu.id)
		if (!entity) return
		if (!isPanel(entity)) return
		const string = this._entities.strings.getEntityById(entity.stringId)
		return {
			...entity,
			string,
		}
	}
}
