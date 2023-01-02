import { inject, Injectable } from '@angular/core'
import {
  BlocksFacade,
  EntitiesFacade,
  GridFacade,
  LinksFacade,
  MultiFacade,
  PanelsFacade,
  SelectedFacade,
  StringsFacade,
} from '@project-id/data-access/facades'

@Injectable({
  providedIn: 'root',
})
export class GlobalFacade {
  public blocks = inject(BlocksFacade)
  public entities = inject(EntitiesFacade)
  public grid = inject(GridFacade)
  public links = inject(LinksFacade)
  public multi = inject(MultiFacade)
  public panels = inject(PanelsFacade)
  public selected = inject(SelectedFacade)
  public strings = inject(StringsFacade)
}
