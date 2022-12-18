import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'

import { firstValueFrom, Observable } from 'rxjs'

import { Guid } from 'guid-typescript'

import { MatDialog } from '@angular/material/dialog'
import { MatToolbarModule } from '@angular/material/toolbar'
import { LetModule } from '@ngrx/component'
import { CommonModule } from '@angular/common'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSliderModule } from '@angular/material/slider'
import { AppState } from '@shared/data-access/store'
import {
  GridStateActions,
  MultiActions,
  selectCreateMode,
  SelectedStateActions, selectGridMode,
  selectMultiMode, selectProjectByRouteParams, selectSelectedStringId, selectSelectedStringModel,
  StringsEntityService,
} from '@grid-layout/data-access/store'
import { GridMode, ProjectModel, StringModel, TypeModel } from '@shared/data-access/models'
import { CreateStringComponent, SelectStringComponent, ViewStringsDialog } from '@grid-layout/feature/dialogs'


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
  project$!: Observable<ProjectModel | undefined>
  @Output() zoom = new EventEmitter<number>()
  createMode$!: Observable<TypeModel>
  gridMode$!: Observable<GridMode>
  multiMode$!: Observable<boolean>
  selectedStringId$!: Observable<string | undefined>
  strings$!: Observable<StringModel[]>

  private store = inject(Store<AppState>)
  private stringsEntity = inject(StringsEntityService)
  private dialog = inject(MatDialog)


  ngOnInit(): void {
    this.project$ = this.store.select(selectProjectByRouteParams)
    this.createMode$ = this.store.select(selectCreateMode)
    this.gridMode$ = this.store.select(selectGridMode)
    this.multiMode$ = this.store.select(selectMultiMode)
    this.selectedStringId$ = this.store.select(selectSelectedStringId)
    this.strings$ = this.stringsEntity.entities$
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
