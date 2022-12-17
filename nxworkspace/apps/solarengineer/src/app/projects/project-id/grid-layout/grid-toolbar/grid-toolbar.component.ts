import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { GridStateActions } from '../../services/store/grid/grid.actions'
import { firstValueFrom, Observable } from 'rxjs'
import { ProjectModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/project.model'
import { selectProjectByRouteParams } from '../../services/store/projects/projects.selectors'
import { GridMode } from '../../services/store/grid/grid-mode.model'
import { StringsEntityService } from '../../services/ngrx-data/strings-entity/strings-entity.service'
import { StringModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/string.model'
import { Guid } from 'guid-typescript'
import { TypeModel } from '../../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { SelectStringComponent } from './select-string/select-string.component'
import { CreateStringComponent } from './create-string/create-string.component'
import { MatDialog } from '@angular/material/dialog'
import { MatToolbarModule } from '@angular/material/toolbar'
import { LetModule } from '@ngrx/component'
import { CommonModule } from '@angular/common'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSliderModule } from '@angular/material/slider'
import { ViewStringsDialog } from './view-strings-dialog/view-strings.dialog'
import { SelectedStateActions } from '../../services/store/selected/selected.actions'
import { MultiActions } from '../../services/store/multi-create/multi.actions'
import { selectCreateMode, selectGridMode } from '../../services/store/grid/grid.selectors'
import { selectMultiMode } from '../../services/store/multi-create/multi.selectors'
import {
  selectSelectedStringId,
  selectSelectedStringModel,
} from '../../services/store/selected/selected.selectors'

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    LetModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSliderModule,
  ],
})
export class GridToolbarComponent implements OnInit {
  project$: Observable<ProjectModel | undefined>
  @Output() zoom = new EventEmitter<number>()
  createMode$!: Observable<TypeModel>
  gridMode$!: Observable<GridMode>
  multiMode$!: Observable<boolean>
  selectedStringId$!: Observable<string | undefined>

  constructor(
    private store: Store<AppState>,
    public stringsEntity: StringsEntityService,
    public dialog: MatDialog,
  ) {
    this.project$ = this.store.select(selectProjectByRouteParams)
  }

  ngOnInit(): void {
    this.createMode$ = this.store.select(selectCreateMode)
    this.gridMode$ = this.store.select(selectGridMode)
    this.multiMode$ = this.store.select(selectMultiMode)
    this.selectedStringId$ = this.store.select(selectSelectedStringId)
  }

  openDialog(strings: StringModel[]): void {
    const dialogRef = this.dialog.open(SelectStringComponent, {
      width: '250px',
      data: { strings },
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
      console.log(result)
    })
  }

  createNewString() {
    const string: StringModel = {
      id: Guid.create().toString(),
      projectId: 3,
      trackerId: '6',
      inverterId: '11',
      name: 'customString',
      isInParallel: false,
      type: TypeModel.STRING,
      color: 'red',
    }
    this.stringsEntity.add(string)
  }

  selectString(string: StringModel) {
    this.store.dispatch(SelectedStateActions.selectString({ stringId: string.id }))
  }

  openNewStringDialog() {
    const dialogRef = this.dialog.open(CreateStringComponent, {
      width: '250px',
    })

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed')
      console.log(result)

      const string: StringModel = {
        id: Guid.create().toString(),
        projectId: 3,
        trackerId: '6',
        inverterId: '11',
        name: result,
        isInParallel: false,
        type: TypeModel.STRING,
        color: 'red',
      }
      this.stringsEntity.add(string)
    })
  }

  selectCreateMode(create: TypeModel) {
    this.store.dispatch(GridStateActions.selectCreateMode({ create }))
  }

  changeGridMode(mode: GridMode) {
    if (mode === GridMode.LINK) {
      firstValueFrom(this.store.select(selectSelectedStringModel)).then((selected) => {
        if (selected.type !== TypeModel.STRING) {
          return console.error('need to select a string to enter link mode')
        }
        if (!selected.selectedStringId) {
          return console.error('need to select a string to enter link mode')
        }
        this.store.dispatch(GridStateActions.changeGridmode({ mode }))
      })
    } else {
      this.store.dispatch(GridStateActions.changeGridmode({ mode }))
    }
  }

  viewStrings() {
    this.dialog.open(ViewStringsDialog)
  }

  toggleMultiMode() {
    this.store.dispatch(MultiActions.toggleMultiMode())
  }
}
