import { Pipe, PipeTransform } from '@angular/core'

import { injectEntityStore } from '@entities/common/data-access'
import { CanvasString } from '../types'

@Pipe({
	name: 'getStringById',
	standalone: true,
})
export class GetStringByIdPipe implements PipeTransform {
	private _entityStore = injectEntityStore()

	// private _entityStore = inject(EntityStoreService)

	transform(stringId: string): CanvasString | undefined {
		return this._entityStore.strings.getById(stringId)
	}
}
