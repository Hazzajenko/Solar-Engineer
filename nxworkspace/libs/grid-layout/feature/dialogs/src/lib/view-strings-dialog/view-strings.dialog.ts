import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { Observable } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'

import { GetStringPanelsPipe } from '@grid-layout/pipes'
import { SelectedStateActions, selectSelectedId, StringsEntityService } from '@grid-layout/data-access/store'
import { StringModel } from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { GetStringStatsPipe } from '../../../../../pipes/src/lib/get-string-stats.pipe'

@Component({
  selector: 'view-strings-dialog',
  templateUrl: 'view-strings.dialog.html',
  styleUrls: ['./view-strings.dialog.scss'],
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
export class ViewStringsDialog implements OnInit {
  strings$!: Observable<StringModel[]>
  selectedStringId$!: Observable<string | undefined>
  show: string[] = []
  showString: string = ''

  constructor(private stringsEntity: StringsEntityService, private store: Store<AppState>) {}

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
}
