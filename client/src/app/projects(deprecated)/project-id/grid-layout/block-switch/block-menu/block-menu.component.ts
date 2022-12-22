import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatMenuModule } from '@angular/material/menu'
import { GridStateActions } from '../../../services/store/grid/grid.actions'
import { GridMode } from '../../../services/store/grid/grid-mode.model'
import { SelectedStateActions } from '../../../services/store/selected/selected.actions'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { TypeModel } from '../../../../models/type.model'

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

  constructor(private store: Store<AppState>) {}

  selectString(stringId: string) {
    // this.store(deprecated).dispatch(GridStateActions.changeGridmode({ mode: GridMode.SELECT }))
    // this.store(deprecated).dispatch(SelectedStateActions.selectType({ objectType: TypeModel.STRING }))
    // this.store(deprecated).dispatch(SelectedStateActions.selectString({ stringId }))
  }
}
