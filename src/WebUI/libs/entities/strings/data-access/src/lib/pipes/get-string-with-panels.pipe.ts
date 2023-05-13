import { inject, Pipe, PipeTransform } from '@angular/core'

import { CanvasString } from '@design-app/shared'
import { EntityStoreService } from '@design-app/data-access'
// import { EntityStoreService } from '../../entity-store.service'

export type StringWithPanelIds = CanvasString & {
	panelIds: string[]
}

@Pipe({
	name: 'getStringWithPanelIds',
	standalone: true,
})
export class GetStringWithPanelIdsPipe implements PipeTransform {
	private _entities = inject(EntityStoreService)

	transform(stringId: string): StringWithPanelIds | undefined {
		console.log('GetStringWithPanelIdsPipe.transform()', stringId)
		const string = this._entities.strings.getById(stringId)
		if (!string) return
		const panelIds = this._entities.panels.getByStringId(stringId).map((panel) => panel.id)
		return {
			...string,
			panelIds,
		}
	}
}
