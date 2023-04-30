// import { CanvasEntity } from '@design-app/feature-design-canvas'
import { CanvasString } from '../../types'
import { EntityStateTemplate } from './entity-state-template'
import { Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class CanvasStringsStore extends EntityStateTemplate<CanvasString> {
	public override addEntity(entity: CanvasString) {
		super.addEntity(entity)
		console.log('CanvasStringsStore.addEntity', entity)
	}
}
