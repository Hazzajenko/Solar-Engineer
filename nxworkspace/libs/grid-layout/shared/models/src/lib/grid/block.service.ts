import { BlockType } from './block.model'
import { Injectable, inject } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { BlocksSelectors, BlocksActions, PanelsSelectors } from '@project-id/data-access/store'
import { BlockModel, TypeModel } from '@shared/data-access/models'
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BlockService {
  private readonly store = inject(Store)

  getChild(id: string, type: BlockType) {
    switch (type) {
      case BlockType.PANEL:
        return this.store.select(PanelsSelectors.selectPanelById({ id }))
      default:
        return this.store.select(PanelsSelectors.selectPanelById({ id }))
    }
  }

}
