import { CanvasClientStateService } from '../../../../services'
import { CanvasEntity, CanvasString, isPanel } from '../../../../types'
import { inject, Pipe, PipeTransform } from '@angular/core'

export type PanelWithString = CanvasEntity & {
	string: CanvasString | undefined
}

@Pipe({
	name: 'getEntityById',
	standalone: true,
})
export class GetEntityByIdPipe implements PipeTransform {
	private _state = inject(CanvasClientStateService)

	transform(entityId: string): PanelWithString | undefined {
		const entity = this._state.entities.panels.getEntityById(entityId)
		if (!entity) return
		if (!isPanel(entity)) return
		const string = this._state.entities.strings.getEntityById(entity.stringId)
		return {
			...entity,
			string,
		}
		// if (isPanel(entity)) {
		/*			if (entity.stringId) {
		 const string = this._state.entities.canvasStrings.getEntityById(entity.stringId)
		 return {
		 ...entity,
		 string,
		 }
		 }*/
		// }
		// return undefined
	}
}