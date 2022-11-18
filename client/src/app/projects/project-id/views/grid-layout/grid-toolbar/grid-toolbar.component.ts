import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import {
  CreateMode,
  GridStateActions,
} from '../../../../store/grid/grid.actions'
import { Observable } from 'rxjs'
import { ProjectModel } from '../../../../models/project.model'
import { selectProjectByRouteParams } from '../../../../store/projects/projects.selectors'
import { GridMode } from '../../../../store/grid/grid-mode.model'

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
})
export class GridToolbarComponent implements OnInit {
  project$: Observable<ProjectModel | undefined>

  constructor(private store: Store<AppState>) {
    this.project$ = this.store.select(selectProjectByRouteParams)
  }

  ngOnInit(): void {}

  selectCreatePanelMode() {
    this.store.dispatch(
      GridStateActions.selectPanelCreateMode({ mode: CreateMode.PANEL }),
    )
  }

  selectCreateCableMode() {
    this.store.dispatch(
      GridStateActions.selectCableCreateMode({ mode: CreateMode.CABLE }),
    )
  }

  enterDeleteMode() {
    this.store.dispatch(
      GridStateActions.selectGridmodeDelete({ mode: GridMode.DELETE }),
    )
  }

  enterCreateMode() {
    this.store.dispatch(
      GridStateActions.selectGridmodeCreate({ mode: GridMode.CREATE }),
    )
  }
}
