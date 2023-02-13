import { inject, Injectable } from '@angular/core'
import { GridFacade } from './grid.facade'
import { GridRepository } from './grid.repository'


@Injectable({
  providedIn: 'root',
})
export class GridStoreService {
  public select = inject(GridFacade)
  public dispatch = inject(GridRepository)
}
