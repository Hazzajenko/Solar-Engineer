import { SelectedQueries } from './selected.queries'
import { SelectedRepository } from './selected.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class SelectedStoreService {
	public readonly select = inject(SelectedQueries)
	public readonly dispatch = inject(SelectedRepository)
}
