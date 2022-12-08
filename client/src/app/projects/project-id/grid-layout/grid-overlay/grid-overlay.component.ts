import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { Observable, switchMap } from 'rxjs'
import { PanelModel } from '../../../models/panel.model'
import { selectSelectedStringId } from '../../services/store/selected/selected.selectors'
import { AsyncPipe, NgIf } from '@angular/common'
import { StringModel } from '../../../models/string.model'
import { StringsEntityService } from '../../services/ngrx-data/strings-entity/strings-entity.service'
import { map } from 'rxjs/operators'
import { StatsService } from '../../services/stats.service'
import { StringTotalsAsyncPipe } from '../grid-toolbar/string-totals-async.pipe'
import { StringStatsAsyncPipe } from './string-stats-async.pipe'

@Component({
  selector: 'app-grid-overlay',
  templateUrl: 'grid-overlay.component.html',
  styleUrls: ['grid-overlay.component.scss'],
  imports: [AsyncPipe, NgIf, StringTotalsAsyncPipe, StringStatsAsyncPipe],
  standalone: true,
})
export class GridOverlayComponent implements OnInit {
  selectedStringId$!: Observable<string | undefined>
  selectedString$!: Observable<StringModel | undefined>
  constructor(
    private store: Store<AppState>,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
  ) {}

  ngOnInit() {
    // this.selectedStringId$ = this.store.select(selectSelectedStringId)
    this.selectedString$ = this.store
      .select(selectSelectedStringId)
      .pipe(
        switchMap((stringId) =>
          this.stringsEntity.entities$.pipe(
            map((strings) => strings.find((s) => s.id === stringId)),
          ),
        ),
      )
    // this.statsService.calculateStringTotalsV2()
  }
}
