import { Pipe, PipeTransform } from '@angular/core'

import { injectEntityStore } from '@entities/data-access'
import { StringId, StringModel } from '@entities/shared'

@Pipe({
	name: 'getStringById',
	standalone: true,
})
export class GetStringByIdPipe implements PipeTransform {
	private _entityStore = injectEntityStore()

	// private _entityStore = injectEntityStore()

	transform(stringId: StringId): StringModel | undefined {
		return this._entityStore.strings.select.getById(stringId)
	}
}
