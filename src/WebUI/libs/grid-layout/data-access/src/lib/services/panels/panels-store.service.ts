import { inject, Injectable } from '@angular/core'
import { PanelsFacade } from './panels.facade'
import { PanelsRepository } from './panels.repository'

@Injectable({
  providedIn: 'root',
})
export class PanelsStoreService {
  public select = inject(PanelsFacade)
  public dispatch = inject(PanelsRepository)
}
