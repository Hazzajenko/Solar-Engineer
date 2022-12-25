import { Injectable, inject } from '@angular/core'
import { createEffect, Actions, ofType } from '@ngrx/effects'
import { fetch } from '@nrwl/angular'

import * as BlocksActions from './blocks.actions'
import * as BlocksFeature from './blocks.reducer'

@Injectable()
export class BlocksEffects {
  private actions$ = inject(Actions)

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BlocksActions.initBlocks),
      fetch({
        run: (action) => {
          // Your custom service 'load' logic goes here. For now just return a success action...
          return BlocksActions.loadBlocksSuccess({ blocks: [] })
        },
        onError: (action, error) => {
          console.error('Error', error)
          return BlocksActions.loadBlocksFailure({ error })
        },
      }),
    ),
  )
}
