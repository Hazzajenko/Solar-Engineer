import { PanelsStoreService } from './panels'
import { StringsStoreService } from './strings'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class EntityStoreService {
	panels = inject(PanelsStoreService)
	strings = inject(StringsStoreService)
}
