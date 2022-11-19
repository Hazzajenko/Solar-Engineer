import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { GridStateActions } from '../../../../store/grid/grid.actions'
import { Observable } from 'rxjs'
import { ProjectModel } from '../../../../models/project.model'
import { selectProjectByRouteParams } from '../../../../store/projects/projects.selectors'
import { GridMode } from '../../../../store/grid/grid-mode.model'
import { StringsEntityService } from '../../../services/strings-entity/strings-entity.service'
import { StringModel } from '../../../../models/string.model'
import { Guid } from 'guid-typescript'
import { UnitModel } from '../../../../models/unit.model'
import { MatDialog } from '@angular/material/dialog'
import { SelectStringComponent } from './select-string/select-string.component'
import { CreateStringComponent } from './create-string/create-string.component'

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
})
export class GridToolbarComponent implements OnInit {
  project$: Observable<ProjectModel | undefined>

  constructor(
    private store: Store<AppState>,
    public stringsEntity: StringsEntityService,
    public dialog: MatDialog,
  ) {
    this.project$ = this.store.select(selectProjectByRouteParams)
  }

  ngOnInit(): void {}

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
      project_id: 3,
      tracker_id: '6',
      inverter_id: '11',
      name: 'customString',
      is_in_parallel: false,
      model: UnitModel.STRING,
      color: 'red',
    }
    this.stringsEntity.add(string)
  }

  selectString(string: StringModel) {
    this.store.dispatch(GridStateActions.selectStringForGrid({ string }))
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
        project_id: 3,
        tracker_id: '6',
        inverter_id: '11',
        name: result,
        is_in_parallel: false,
        model: UnitModel.STRING,
        color: 'red',
      }
      this.stringsEntity.add(string)
    })
  }

  selectCreateMode(create: UnitModel) {
    this.store.dispatch(GridStateActions.selectCreateMode({ create }))
  }

  changeGridMode(mode: GridMode) {
    this.store.dispatch(GridStateActions.changeGridmode({ mode }))
  }
}
