import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { PanelModel } from '../../../../models/panel.model'
import { PanelsEntityService } from './panels-entity.service'

@Injectable({
  providedIn: 'root',
})
export class PanelsService {
  panels$: Observable<PanelModel[]>

  constructor(private panelsEntity: PanelsEntityService) {
    this.panels$ = this.panelsEntity.entities$
  }

  public getBlocksFromIncludedArray(array: string[]) {
    return this.panels$.pipe(map((panels) => panels.filter((panel) => array.includes(panel.id!))))
  }
}
