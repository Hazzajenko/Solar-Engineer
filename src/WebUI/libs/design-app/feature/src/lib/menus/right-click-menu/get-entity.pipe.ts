import { inject, Pipe, PipeTransform } from '@angular/core'
import { EntityStoreService } from '@design-app/data-access'
import { CanvasEntity, CanvasString } from '@design-app/shared'
import { isPanel } from '@design-app/utils'

export type PanelWithString = CanvasEntity & {
	string: CanvasString | undefined
}

@Pipe({
	name: 'getEntityById',
	standalone: true,
})
export class GetEntityByIdPipe implements PipeTransform {
	private _entities = inject(EntityStoreService)

	transform(entityId: string): PanelWithString | undefined {
		const entity = this._entities.panels.getEntityById(entityId)
		if (!entity) return
		if (!isPanel(entity)) return
		const string = this._entities.strings.getEntityById(entity.stringId)
		return {
			...entity,
			string,
		}
	}
}