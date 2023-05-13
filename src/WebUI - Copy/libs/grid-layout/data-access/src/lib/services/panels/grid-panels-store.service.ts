import { inject, Injectable } from '@angular/core'
import { GridPanelsFacade } from './grid-panels.facade'
import { GridPanelsRepository } from './grid-panels.repository'

@Injectable({
  providedIn: 'root',
})
export class GridPanelsStoreService {
  public select = inject(GridPanelsFacade)
  public dispatch = inject(GridPanelsRepository)
}
