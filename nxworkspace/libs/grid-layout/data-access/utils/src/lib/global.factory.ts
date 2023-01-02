import { inject, Injectable } from '@angular/core'
import {
  GridFactory,
  LinkFactory,
  MultiFactory,
  PanelFactory,
  SelectedFactory,
  StringFactory,
} from '@grid-layout/data-access/utils'

@Injectable({
  providedIn: 'root',
})
export class GlobalFactory {
  public grid = inject(GridFactory)
  public links = inject(LinkFactory)
  public multi = inject(MultiFactory)
  public panels = inject(PanelFactory)
  public selected = inject(SelectedFactory)
  public strings = inject(StringFactory)

}
