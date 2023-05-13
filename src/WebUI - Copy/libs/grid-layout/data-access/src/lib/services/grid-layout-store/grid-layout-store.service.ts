import { inject, Injectable } from '@angular/core'
import { BlocksFacade, GridFacade, GridPanelsFacade, GridSelectedFacade, GridStringsFacade, LinksFacade, MultiFacade } from '../'

@Injectable({
  providedIn: 'root',
})
export class GridLayoutStoreService {
  public blocks = inject(BlocksFacade)
  // public entities = inject(EntitiesFacade)
  public grid = inject(GridFacade)
  public links = inject(LinksFacade)
  public multi = inject(MultiFacade)
  public panels = inject(GridPanelsFacade)
  public selected = inject(GridSelectedFacade)
  public strings = inject(GridStringsFacade)
}
