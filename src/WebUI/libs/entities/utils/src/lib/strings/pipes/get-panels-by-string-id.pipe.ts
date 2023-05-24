import { inject, Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '@entities/shared'
import { EntityStoreService } from '@entities/data-access'

@Pipe({
	name: 'getPanelsByStringId',
	standalone: true,
})
export class GetPanelsByStringIdPipe implements PipeTransform {
	private _entityStore = inject(EntityStoreService)

	// private _entityStore = inject(EntityStoreService)

	transform(stringId: string): PanelModel[] {
		return this._entityStore.panels.getByStringId(stringId)
	}
}
