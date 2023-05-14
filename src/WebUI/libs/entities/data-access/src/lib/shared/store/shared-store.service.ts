import { inject, Injectable } from '@angular/core'
import { injectPanelsFeature } from '../../panels'
import { StringsStoreService } from '../../strings'

@Injectable({
	providedIn: 'root',
})
export class EntityStoreService {
	panels = injectPanelsFeature()
	// panels = inject(PanelsStoreService)
	strings = inject(StringsStoreService)
}
