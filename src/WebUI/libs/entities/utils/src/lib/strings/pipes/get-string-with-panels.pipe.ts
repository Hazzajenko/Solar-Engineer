import { inject, Pipe, PipeTransform } from '@angular/core'
import { StringModel } from '@entities/shared'
import { EntityStoreService } from '@entities/data-access'
// import { EntityStoreService } from '../../entity-store.service'

export type StringWithPanelIds = StringModel & {
	panelIds: string[]
}

@Pipe({
	name: 'getStringWithPanelIds',
	standalone: true,
})
export class GetStringWithPanelIdsPipe implements PipeTransform {
	private _entities = inject(EntityStoreService)
	// private _panelsStore = injectPanelsFeature()
	// private _stringsStore = injectStringsFeature()

	// private _entities = inject(EntityStoreService)

	transform(stringId: string): StringWithPanelIds | undefined {
		console.log('GetStringWithPanelIdsPipe.transform()', stringId)
		// const string = this._stringsStore.getById(stringId)
		const string = this._entities.strings.getById(stringId)
		if (!string) return
		// const panelIds = this._panelsStore.getByStringId(stringId).map((panel) => panel.id)
		const panelIds = this._entities.panels.getByStringId(stringId).map((panel) => panel.id)
		return {
			...string,
			panelIds,
		}
	}
}
