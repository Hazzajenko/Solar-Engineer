import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatMenuModule } from '@angular/material/menu'
import { GridDeleteService } from '../../../../../services/grid/grid-delete.service'
import { GridStateActions } from '../../../../../store/grid/grid.actions'
import { GridMode } from '../../../../../store/grid/grid-mode.model'
import { SelectedStateActions } from '../../../../../store/selected/selected.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../../store/app.state'
import { UnitModel } from '../../../../../models/unit.model'

@Component({
  selector: 'app-block-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './block-menu.component.html',
  styleUrls: ['./block-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockMenuComponent {
  @Input() item: any

  constructor(
    public gridDelete: GridDeleteService,
    private store: Store<AppState>,
  ) {}

  selectString(stringId: string) {
    this.store.dispatch(
      GridStateActions.changeGridmode({ mode: GridMode.SELECT }),
    )
    this.store.dispatch(
      SelectedStateActions.selectUnit({ unit: UnitModel.STRING }),
    )
    this.store.dispatch(SelectedStateActions.selectString({ stringId }))
  }
}
