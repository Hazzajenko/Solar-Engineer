import { Component, EventEmitter, OnInit, Output } from '@angular/core'
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

  constructor(
    private store: Store<AppState>,
    public stringsEntity: StringsEntityService,
    public dialog: MatDialog,
  ) {
    this.project$ = this.store.select(selectProjectByRouteParams)
  }

  formatLabel(value: number): string {
    return `${value}%`
    /*    if (value >= 1000) {
          return Math.round(value / 1000) + 'k';
        }

        return `${value}`;*/
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
