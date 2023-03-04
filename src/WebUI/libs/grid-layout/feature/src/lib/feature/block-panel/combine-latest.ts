import { LinksFacade, PanelsFacade, SelectedFacade } from '@project-id/data-access/facades'
import { BlockType } from '@shared/data-access/models'
import { combineLatestWith, map, Observable } from 'rxjs'
export const isSelectedPanel$ = (selectedFacade: SelectedFacade, id: string): Observable<boolean> =>
  selectedFacade.selectedIdWithType$.pipe(
    map(({ singleSelectId, type }) => {
      if (type !== BlockType.PANEL) {
        return false
      }
      if (singleSelectId === id) {
        return true
      }
      return false
    }),
  )

export const getPanelNg = (
  selectedFacade: SelectedFacade,
  panelsFacade: PanelsFacade,
  linksFacade: LinksFacade,
  id: string,
) => {
  const isSelectedPanel$: Observable<boolean> = selectedFacade.selectedIdWithType$.pipe(
    map(({ singleSelectId, type }) => {
      if (type !== BlockType.PANEL) {
        return false
      }
      if (singleSelectId === id) {
        return true
      }
      return false
    }),
  )
  const isSelectedPositiveTo$: Observable<boolean> = selectedFacade.selectSelectedPositiveTo$.pipe(
    map((positiveToId) => {
      if (positiveToId === id) {
        return true
      }
      return false
    }),
  )
  const isSelectedNegativeTo$: Observable<boolean> = selectedFacade.selectSelectedNegativeTo$.pipe(
    map((negativeToId) => {
      if (negativeToId === id) {
        return true
      }
      return false
    }),
  )
  const isSelectedString$: Observable<boolean> = selectedFacade.selectedStringId$.pipe(
    combineLatestWith(panelsFacade.selectStringIdByPanelId$(id)),
    map(([selectedStringId, stringId]) => {
      if (selectedStringId === stringId) {
        return true
      }
      return false
    }),
  )
  const isToLinkId$: Observable<boolean> = linksFacade.toLinkId$.pipe(
    map((toLinkId) => {
      if (toLinkId === id) {
        return true
      }
      return false
    }),
  )

  const $array: Observable<boolean>[] = []
  $array.push(isSelectedPanel$)
  $array.push(isSelectedPositiveTo$)
  $array.push(isSelectedNegativeTo$)
  $array.push(isSelectedString$)
  $array.push(isToLinkId$)

  return $array
}
