import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import {
  CreateMode,
  GridStateActions,
} from '../../../../store/grid/grid.actions'

@Component({
  selector: 'app-grid-toolbar',
  templateUrl: './grid-toolbar.component.html',
  styleUrls: ['./grid-toolbar.component.scss'],
})
export class GridToolbarComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

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
}
