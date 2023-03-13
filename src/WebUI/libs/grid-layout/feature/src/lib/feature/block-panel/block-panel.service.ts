import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { BaseService } from '@shared/logger'
import {
  isPanelStringSelected,
  isPanelToLink,
  selectBlockPanelById,
  selectPanelSelected,
  selectPathByPanelId,
  selectSelectedPanelLinkPathByPanelId,
  selectStringNameAndColorById,
} from './selectors/block-panel.selectors'
import { combineLatestWith } from 'rxjs/operators'
import { map } from 'rxjs'
import { PanelComponentState } from './models/panel-component.state'
import { BLOCK_TYPE } from '@shared/data-access/models'

@Injectable()
export class BlockPanelService extends BaseService {
  private store = inject(Store)
  selectBlockById$ = (id: string) => this.store.pipe(select(selectBlockPanelById({ id })))

  panelComponentState$(id: string) {
    return this.selectBlockById$(id).pipe(
      combineLatestWith(
        this.store.pipe(select(selectStringNameAndColorById({ id }))),
        this.store.pipe(select(selectPanelSelected({ id }))),
        this.store.pipe(select(isPanelStringSelected({ id }))),
        this.store.pipe(select(selectPathByPanelId({ panelId: id }))),
        this.store.pipe(select(selectSelectedPanelLinkPathByPanelId({ panelId: id }))),
        this.store.pipe(select(isPanelToLink({ panelId: id }))),
      ),
      map(
        ([
          panel,
          string,
          selected,
          stringSelected,
          panelPath,
          selectedPanelPath,
          isPanelToLink,
        ]) => {
          if (!panel || !string) return undefined
          const res: PanelComponentState = {
            id: panel.id,
            stringId: panel.stringId,
            rotation: panel.rotation,
            location: panel.location,
            stringName: string.stringName,
            stringColor: string.stringColor,
            selected,
            stringSelected,
            panelPath,
            selectedPanelPath,
            isPanelToLink,
            type: BLOCK_TYPE.PANEL,
          }
          return res
        },
      ),
    )
  }
}
