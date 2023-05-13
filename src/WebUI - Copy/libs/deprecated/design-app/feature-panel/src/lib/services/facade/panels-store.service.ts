import { PanelsQueries } from './panels.queries'
import { PanelsRepository } from './panels.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class PanelsStoreService {
	public select = inject(PanelsQueries)
	public dispatch = inject(PanelsRepository)
}
