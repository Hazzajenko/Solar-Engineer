import { Injectable } from '@angular/core'
import { CanvasString } from '@design-app/shared'
import { EntityStateTemplate } from '@design-app/utils'


@Injectable({
	providedIn: 'root',
})
export class CanvasStringsStore extends EntityStateTemplate<CanvasString> {}