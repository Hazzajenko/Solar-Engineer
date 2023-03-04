import { AsyncPipe, NgIf } from '@angular/common'
import { Component, inject, Input } from '@angular/core'
import { SelectedFacade, StringsFacade } from '@grid-layout/data-access'
import { StringModel } from '@shared/data-access/models'
import { StringStatsAsyncPipe } from './string-stats-async.pipe'

import { switchMap } from 'rxjs'

import { map } from 'rxjs/operators'

@Component({
  selector: 'app-string-totals-overlay',
  template: `
    <ng-container *ngIf="selectedString">
      <div
        class="pointer-events-none absolute z-50 w-[200px]  transform translate-x-1/2 translate-y-6/7 left-5 bottom-1/2"
      >
        <div class="bg-purple-300/50 pl-4">
          <!--    <div class='pointer-events-none absolute z-50'>-->
          <!--      <div class="text">Text</div>-->
          <!--      <ng-container *ngIf='selectedString$ | async as string'>-->
          <!--        <div draggable='true' class='mat-typography absolute top-[40%] left-[10%] h-[40%] bg-purple-400'>-->
          <div class="string-table__string">
            <h3>Selected String Stats</h3>
            <h4>{{ selectedString.name }}</h4>
            <ng-container *ngIf="selectedString | stringStatsAsync | async as stats">
              <div class="string-table__stats">
                <ul style="list-style: none">
                  <li>VOC: {{ stats.totals.totalVoc }}</li>
                  <li>VMP: {{ stats.totals.totalVmp }}</li>
                  <li>PMAX: {{ stats.totals.totalPmax }}</li>
                  <li>ISC: {{ stats.totals.totalIsc }}</li>
                  <li>IMP: {{ stats.totals.totalImp }}</li>
                  <li>PANELS: {{ stats.amountOfPanels }}</li>
                  <li>LINKS: {{ stats.amountOfLinks }}</li>
                  <li>PANELS NOT IN LINK: {{ stats.panelsNotInLink }}</li>
                </ul>
              </div>
            </ng-container>
          </div>
        </div>
        <!--      </ng-container>-->
      </div>
    </ng-container>
  `,
  styles: [],
  imports: [AsyncPipe, NgIf, StringStatsAsyncPipe],
  standalone: true,
})
export class StringTotalsOverlayComponent {
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  @Input() selectedString!: StringModel
  selectedString$ = this.selectedFacade.selectedStringId$.pipe(
    switchMap((stringId) =>
      this.stringsFacade.stringById$(stringId).pipe(
        map((string) => {
          if (!string) return undefined
          return string
        }),
      ),
    ),
  )
}
