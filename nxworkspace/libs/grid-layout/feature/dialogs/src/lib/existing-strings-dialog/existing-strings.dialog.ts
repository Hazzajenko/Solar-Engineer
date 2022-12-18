import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { combineLatestWith, firstValueFrom, Observable } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { AppState } from '@shared/data-access/store'
import {
  PanelsEntityService,
  SelectedStateActions,
  selectSelectedId,
  selectSelectedState, StringsEntityService,
} from '@grid-layout/data-access/store'
import { PanelModel, StringModel } from '@shared/data-access/models'
import { GetStringPanelsPipe } from '@grid-layout/pipes'
import { GetStringStatsPipe } from '../../../../../pipes/src/lib/get-string-stats.pipe'

@Component({
  selector: 'view-strings-dialog',
  templateUrl: 'existing-strings.dialog.html',
  styleUrls: ['./existing-strings.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    GetStringPanelsPipe,
    GetStringStatsPipe,
  ],
  standalone: true,
})
export class ExistingStringsDialog implements OnInit {
  strings$!: Observable<StringModel[]>
  selectedStringId$!: Observable<string | undefined>
  show: string[] = []
  showString: string = ''
  private store = inject(Store<AppState>)
  private stringsEntity = inject(StringsEntityService)
  private panelsEntity = inject(PanelsEntityService)

  ngOnInit() {
    this.strings$ = this.stringsEntity.entities$
    this.selectedStringId$ = this.store.select(selectSelectedId)
  }

  view(string: StringModel) {
    if (this.showString !== '') {
      if (this.showString !== string.id) {
        this.showString = string.id
      } else {
        this.showString = ''
      }
    } else {
      this.showString = string.id
    }
  }

  deleteString(string: StringModel) {
    this.stringsEntity.delete(string)
  }

  selectString(string: StringModel) {
    this.store.dispatch(SelectedStateActions.selectString({ stringId: string.id }))
  }

  addSelectedToExistingString(string: StringModel) {
    firstValueFrom(
      this.store
        .select(selectSelectedState)
        .pipe(combineLatestWith(this.panelsEntity.entities$))
        .pipe(
          map(([selectedState, panels]) => {
            if (selectedState.multiSelect) {
              return panels.filter((p) => selectedState.multiSelectIds?.includes(p.id))
            } else {
              return panels.find((p) => p.id === selectedState.singleSelectId)
            }
          }),
        ),
    ).then(async (selectedPanels) => {
      if (!selectedPanels) {
        return console.error('addSelectedToExistingString !selectedPanels')
      }
      if (Array.isArray(selectedPanels)) {
        const selectedPanelUpdates: Partial<PanelModel>[] = selectedPanels.map((panel) => {
          const partial: Partial<PanelModel> = {
            ...panel,
            stringId: string.id,
          }
          return partial
        })

        this.panelsEntity.updateManyInCache(selectedPanelUpdates)

        /*        return lastValueFrom(
                  this.http.put(`/api/projects/3/panels`, {
                    panels: selectedPanelUpdates,
                    new_string_id: string.id,
                  }),
                )*/
      } else {
        const partial: Partial<PanelModel> = {
          ...selectedPanels,
          stringId: string.id,
        }

        this.panelsEntity.update(partial)
      }
    })
  }
}
