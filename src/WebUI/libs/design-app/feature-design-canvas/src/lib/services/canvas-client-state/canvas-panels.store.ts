// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { CanvasPanel } from '../../types'
import { EntityStateTemplate } from './entity-state-template'
import { Injectable } from '@angular/core'


@Injectable({
	providedIn: 'root',
})
export class CanvasPanelsStore extends EntityStateTemplate<CanvasPanel> {
	getEntitiesByStringId(stringId: string) {
		return this.getEntities().filter((entity) => entity.stringId === stringId)
	}

	/*  getEntitiesByIds(ids: string[]) {
	 return this.getEntities()
	 .filter((entity) => ids.includes(entity.id))
	 }*/
}