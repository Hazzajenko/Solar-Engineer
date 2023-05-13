import { StringsQueries } from './strings.queries'
import { StringsRepository } from './strings.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class StringsStoreService {
	public select = inject(StringsQueries)
	public dispatch = inject(StringsRepository)
}
