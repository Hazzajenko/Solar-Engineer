import { inject, Pipe, PipeTransform } from '@angular/core'
import { EntityStoreService } from '../../entity-store.service'
import { CanvasPanel } from '@entities/panels/data-access'

@Pipe({
	name: 'getPanelsByStringId',
	standalone: true,
})
export class GetPanelsByStringIdPipe implements PipeTransform {
	private _entityStore = inject(EntityStoreService)

	transform(stringId: string): CanvasPanel[] {
		return this._entityStore.panels.getByStringId(stringId)
	}
}
