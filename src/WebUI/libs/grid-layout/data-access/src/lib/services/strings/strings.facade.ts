import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { StringsActions, StringsSelectors } from '../../store'
import { firstValueFrom, map, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class StringsFacade {
  private store = inject(Store)
  loaded$ = this.store.select(StringsSelectors.selectStringsLoaded)
  allStrings$ = this.store.select(StringsSelectors.selectAllStrings)
  stringsFromRoute$ = this.store.select(StringsSelectors.selectStringsByRouteParams)

  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }

  async totalStrings() {
    return firstValueFrom(this.allStrings$.pipe(map(strings => strings.length)))
  }


  stringById$(id: string | undefined) {
    if (!id) return of(undefined)
    return this.store.select(StringsSelectors.selectStringById({ id }))
  }

  stringById(id: string) {
    return firstValueFrom(this.store.select(StringsSelectors.selectStringById({ id })))
  }

  panelPathRecordByStringId$(stringId: string | undefined) {
    if (!stringId) return of(undefined)
    return this.store.select(StringsSelectors.selectPanelPathRecordByStringId({ stringId }))
  }

  panelPathRecordByStringId(stringId: string) {
    return firstValueFrom(this.store.select(StringsSelectors.selectPanelPathRecordByStringId({ stringId })))
  }

}