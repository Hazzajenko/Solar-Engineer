import { inject, Pipe, PipeTransform } from '@angular/core'
import {
	ContextMenuType,
	EntityStoreService,
	isStringContextMenuTemplate,
} from '@design-app/data-access'
import { CanvasString } from '@design-app/shared'

export type StringWithPanelIds = CanvasString & {
	panelIds: string[]
}

@Pipe({
	name: 'getStringWithPanelIds',
	standalone: true,
})
export class GetStringWithPanelIdsPipe implements PipeTransform {
	private _entities = inject(EntityStoreService)

	transform(menu: ContextMenuType | undefined): StringWithPanelIds | undefined {
		if (!menu) return
		if (!isStringContextMenuTemplate(menu)) return
		const string = this._entities.strings.getById(menu.stringId)
		if (!string) return
		return {
			...string,
			panelIds: menu.panelIds,
		}
	}
}
