import { AppStateQueries } from './app-state.queries'
import { AppStateRepository } from './app-state.repository'
import { inject, Injectable } from '@angular/core'

@Injectable({
	providedIn: 'root',
})
export class AppStateStore {
	public select = inject(AppStateQueries)
	public dispatch = inject(AppStateRepository)
}
