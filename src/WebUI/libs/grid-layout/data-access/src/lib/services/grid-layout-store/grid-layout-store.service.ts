import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  // EntitiesFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '../'

@Injectable({
  providedIn: 'root',
})
export class GridLayoutStoreService {
  public blocks = inject(BlocksFacade)
  // public entities = inject(EntitiesFacade)
  public grid = inject(GridFacade)
  public links = inject(LinksFacade)
  public multi = inject(MultiFacade)
  public panels = inject(PanelsFacade)
  public selected = inject(SelectedFacade)
  public strings = inject(StringsFacade)
}
