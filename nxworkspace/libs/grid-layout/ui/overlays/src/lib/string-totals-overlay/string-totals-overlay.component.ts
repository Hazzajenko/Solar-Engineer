import { Component, inject, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

import { Observable, switchMap } from 'rxjs'

import { AsyncPipe, NgIf } from '@angular/common'

import { map } from 'rxjs/operators'


import { AppState } from '@shared/data-access/store'

import { selectSelectedStringId, StringsEntityService } from '@grid-layout/data-access/store'
import { StringModel } from '@shared/data-access/models'
import { GetStringStatsPipe } from '../../../../../pipes/src/lib/get-string-stats.pipe'

@Component({
  selector: 'app-string-totals-overlay',
  templateUrl: 'string-totals-overlay.component.html',
  styleUrls: ['string-totals-overlay.component.scss'],
  imports: [AsyncPipe, NgIf, GetStringStatsPipe],
  standalone: true,
})
export class StringTotalsOverlayComponent implements OnInit {
  selectedStringId$!: Observable<string | undefined>
  selectedString$!: Observable<StringModel | undefined>
  private store = inject(Store<AppState>)
  private stringsEntity = inject(StringsEntityService)

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
