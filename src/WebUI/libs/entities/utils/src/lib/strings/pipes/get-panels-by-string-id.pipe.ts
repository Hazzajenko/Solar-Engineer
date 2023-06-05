import { Pipe, PipeTransform } from '@angular/core'
import { PanelModel } from '@entities/shared'
import { injectEntityStore } from '@entities/data-access'

@Pipe({
	name: 'getPanelsByStringId',
	standalone: true,
})
export class GetPanelsByStringIdPipe implements PipeTransform {
	private _entityStore = injectEntityStore()

	// private _entityStore = injectEntityStore()

	transform(stringId: string): PanelModel[] {
		return this._entityStore.panels.getByStringId(stringId)
	}
}
