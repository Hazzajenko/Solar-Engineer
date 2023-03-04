import { inject, Injectable } from '@angular/core'
import { Update } from '@ngrx/entity'
import { Store } from '@ngrx/store'
import { BlocksActions } from '../../store'
import { BlockModel } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class BlocksRepository {
  private readonly store = inject(Store)

  updateBlock(update: Update<BlockModel>) {
    this.store.dispatch(BlocksActions.updateBlockForGrid({ update }))
  }
}
