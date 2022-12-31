import { inject } from '@angular/core'
import { SelectedFacade } from '@project-id/data-access/facades'
import { BlockType } from '@shared/data-access/models'
import { map, Observable } from 'rxjs'
/*
isSelectedPanel$: Observable<boolean> = this.selectedFacade.selectedIdWithType$.pipe(
  map(({ singleSelectId, type }) => {
    if (type !== BlockType.PANEL) {
      return false
    }
    if (singleSelectId === this._id) {
      return true
    }
    return false
  }),
) */

export const isSelectedPanel$ = (): ((panelId: string) => Observable<boolean>) => {
  const selectedFacade = inject(SelectedFacade)
  return (panelId: string) => {
    return selectedFacade.selectedIdWithType$.pipe(
      map(({ singleSelectId, type }) => {
        if (type !== BlockType.PANEL) {
          return false
        }
        if (singleSelectId === panelId) {
          return true
        }
        return false
      }),
    )
  }
}

export const isSelectedPanel2$ = (
  selected: SelectedFacade,
  panelId: string,
): Observable<boolean> => {
  return selected.selectedIdWithType$.pipe(
    map(({ singleSelectId, type }) => {
      if (type !== BlockType.PANEL) {
        return false
      }
      if (singleSelectId === panelId) {
        return true
      }
      return false
    }),
  )
}
