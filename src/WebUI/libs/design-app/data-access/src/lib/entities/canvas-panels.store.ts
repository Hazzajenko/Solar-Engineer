import { Injectable } from '@angular/core'
import { CanvasPanel } from '@design-app/shared'
import { EntityStateTemplate } from '@design-app/utils'


@Injectable({
	providedIn: 'root',
})
export class CanvasPanelsStore extends EntityStateTemplate<CanvasPanel> {
	getEntitiesByStringId(stringId: string) {
		return this.getEntities().filter((entity) => entity.stringId === stringId)
	}
}