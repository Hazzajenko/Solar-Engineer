import { inject, Injectable } from '@angular/core'
import { SelectedQueries } from './selected.queries'
import { SelectedRepository } from './selected.repository'

@Injectable({
  providedIn: 'root',
})
export class SelectedStoreService {
  public readonly select = inject(SelectedQueries)
  public readonly dispatch = inject(SelectedRepository)
}