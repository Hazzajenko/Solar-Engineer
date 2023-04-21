import { inject, Injectable } from '@angular/core'
import { CanvasStringsStore } from './canvas-strings.store'
import { CanvasPanel, CanvasString, CanvasStringFactory, genStringName } from '../../types'
// import { CanvasEntitiesStore } from '../canvas-entities'
import { mapToUpdateArr } from '../../utils'

@Injectable({
  providedIn: 'root',
})
export class CanvasStringsService {
  private _stringsStore = inject(CanvasStringsStore)

  // private _panelsStore = inject(CanvasEntitiesStore)

  public createStringWithPanels(selectedPanels: CanvasPanel[], currentStrings: CanvasString[]) {
    const stringName = genStringName(currentStrings)
    const newString = CanvasStringFactory.create(stringName)
    this._stringsStore.dispatch.addCanvasString(newString)
    const updates = mapToUpdateArr(selectedPanels, { stringId: newString.id })
    // this._panelsStore.dispatch.updateManyCanvasEntities(updates)
    // this._
    // TODO update panels with new stringId
  }
}
