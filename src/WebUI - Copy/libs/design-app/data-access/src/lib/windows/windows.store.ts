import { WindowsQueries } from './windows.queries'
import { WindowsRepository } from './windows.repository'
import { inject, Injectable } from '@angular/core'


@Injectable({
	providedIn: 'root',
})
export class WindowsStore {
	public select = inject(WindowsQueries)
	public dispatch = inject(WindowsRepository)
}