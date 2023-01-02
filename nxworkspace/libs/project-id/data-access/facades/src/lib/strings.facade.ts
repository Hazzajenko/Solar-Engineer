import { Update } from '@ngrx/entity'
import { StringModel } from '@shared/data-access/models'
import { inject, Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { StringsActions, StringsSelectors } from '@project-id/data-access/store'
import { firstValueFrom, map, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class StringsFacade {
  private readonly store = inject(Store)
  loaded$ = this.store.select(StringsSelectors.selectStringsLoaded)
  allStrings$ = this.store.select(StringsSelectors.selectAllStrings)
  stringsFromRoute$ = this.store.select(StringsSelectors.selectStringsByRouteParams)

  initSelectProject(projectId: number) {
    this.store.dispatch(StringsActions.initStrings({ projectId }))
  }

  async totalStrings() {
    return firstValueFrom(this.allStrings$.pipe(map(strings => strings.length)))
  }

  createString(string: StringModel) {
    this.store.dispatch(StringsActions.addString({ string }))
  }

  /*
    stringById$(id: string) {
      return this.store.select(StringsSelectors.selectStringById({ id }))
    }
  */

  stringById$(id: string | undefined) {
    if (!id) return of(undefined)
    return this.store.select(StringsSelectors.selectStringById({ id }))
  }

  stringById(id: string) {
    return firstValueFrom(this.store.select(StringsSelectors.selectStringById({ id })))
  }

  update(update: Update<StringModel>) {
    this.store.dispatch(StringsActions.updateString({ update }))
  }

  delete(stringId: string) {
    this.store.dispatch(StringsActions.deleteString({ stringId }))
  }
}
