import { inject, Pipe, PipeTransform } from '@angular/core'

import { EntityStoreService } from '@entities/data-access'
import { CanvasString } from '@entities/shared'

@Pipe({
	name: 'getStringById',
	standalone: true,
})
export class GetStringByIdPipe implements PipeTransform {
	private _entityStore = inject(EntityStoreService)

	// private _entityStore = inject(EntityStoreService)

	transform(stringId: string): CanvasString | undefined {
		return this._entityStore.strings.getById(stringId)
	}
}
