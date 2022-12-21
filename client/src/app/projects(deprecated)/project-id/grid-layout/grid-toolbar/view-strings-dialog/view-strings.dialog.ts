import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { Observable } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'
import { StringsEntityService } from '../../../services/ngrx-data/strings-entity/strings-entity.service'
import { StringModel } from '../../../../models/string.model'
import { MatIconModule } from '@angular/material/icon'
import { StringTotalsAsyncPipe } from '../string-totals-async.pipe'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { selectSelectedId } from '../../../services/store/selected/selected.selectors'
import { StringPanelsAsyncPipe } from './string-panels-async.pipe'

@Component({
  selector: 'view-strings-dialog',
  templateUrl: 'view-strings.dialog.html',
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
export class ViewStringsDialog implements OnInit {
  strings$!: Observable<StringModel[]>
  selectedStringId$!: Observable<string | undefined>
  show: string[] = []
  showString: string = ''

  constructor(
    private stringsEntity: StringsEntityService,
    private store: Store<AppState>,
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
}
