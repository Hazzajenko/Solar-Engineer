import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import {
  combineLatestWith,
  firstValueFrom,
  lastValueFrom,
  Observable,
} from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'

import { StringPanelsAsyncPipe } from './string-panels-async.pipe'
import { StringTotalsAsyncPipe } from '../../../grid-toolbar/string-totals-async.pipe'
import {
  selectMultiSelectIds,
  selectSelectedId,
} from '../../../../services/store/selected/selected.selectors'
import { SelectedStateActions } from '../../../../services/store/selected/selected.actions'
import { StringsEntityService } from '../../../../services/ngrx-data/strings-entity/strings-entity.service'
import { StringModel } from '../../../../../models/string.model'
import { AppState } from '../../../../../../store/app.state'
import { map } from 'rxjs/operators'
import { PanelModel } from '../../../../../models/panel.model'
import { PanelsEntityService } from '../../../../services/ngrx-data/panels-entity/panels-entity.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'view-strings-dialog',
  templateUrl: 'existing-strings.dialog.html',
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &__button-menu {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }

        &__string-info {
          padding-left: 15px;
        }
      }

      .typo-test {
        font-family: unquote('Roboto'), serif;
        font-size: 16px;
      }

      .viewport {
        height: 400px;
        width: 400px;

        &__mat-list-string {
          background-color: white;

          &:hover {
            background-color: #7bd5ff;
            //color: #38c1ff;
          }
        }
      }
    `,
  ],
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
    StringTotalsAsyncPipe,
    StringPanelsAsyncPipe,
  ],
  standalone: true,
})
export class ExistingStringsDialog implements OnInit {
  strings$!: Observable<StringModel[]>
  selectedStringId$!: Observable<string | undefined>
  show: string[] = []
  showString: string = ''

  constructor(
    private stringsEntity: StringsEntityService,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private http: HttpClient,
  ) {}

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
    this.store.dispatch(
      SelectedStateActions.selectString({ stringId: string.id }),
    )
  }

  addSelectedToExistingString(string: StringModel) {
    firstValueFrom(
      this.store
        .select(selectMultiSelectIds)
        .pipe(combineLatestWith(this.panelsEntity.entities$))
        .pipe(
          map(([multiSelectIds, panels]) => {
            return panels.filter((p) => multiSelectIds?.includes(p.id))
          }),
        ),
    ).then(async (selectedPanels) => {
      const selectedPanelUpdates: Partial<PanelModel>[] = selectedPanels.map(
        (panel) => {
          const partial: Partial<PanelModel> = {
            ...panel,
            string_id: string.id,
            color: string.color,
          }
          return partial
        },
      )

      this.panelsEntity.updateManyInCache(selectedPanelUpdates)

      return lastValueFrom(
        this.http.put(`/api/projects/3/panels`, {
          panels: selectedPanelUpdates,
          new_string_id: string.id,
        }),
      )
    })
  }
}
