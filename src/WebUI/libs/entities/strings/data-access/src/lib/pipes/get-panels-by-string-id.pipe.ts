import { Pipe, PipeTransform } from '@angular/core'
import { CanvasPanel } from '@entities/panels/data-access'
import { injectEntityStore } from '@entities/common/data-access'

@Pipe({
	name: 'getPanelsByStringId',
	standalone: true,
})
export class GetPanelsByStringIdPipe implements PipeTransform {
	private _entityStore = injectEntityStore()

	// private _entityStore = inject(EntityStoreService)

	transform(stringId: string): CanvasPanel[] {
		return this._entityStore.panels.getByStringId(stringId)
	}
}
