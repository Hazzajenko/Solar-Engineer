import { AsyncPipe, NgIf } from '@angular/common'
import { Component, inject } from '@angular/core'
import { SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { StringStatsAsyncPipe } from 'libs/grid-layout/feature/string-stats/src/lib/string-stats-async.pipe'

import { Observable, switchMap } from 'rxjs'

import { map } from 'rxjs/operators'

@Component({
  selector: 'app-string-totals-overlay',
  template: `
    <div class='pointer-events-none absolute z-50'>
      <!--      <div class="text">Text</div>-->
      <ng-container *ngIf='selectedString$ | async as string'>
        <div draggable='true' class='mat-typography absolute top-[40%] left-[10%] h-[40%] bg-purple-400'>
          <div class='string-table__string'>
            <h3>Selected String Stats</h3>
            <h4>{{ string.name }}</h4>
            <ng-container *ngIf='string | stringStatsAsync | async as stats'>
              <div class='string-table__stats'>
                <ul style='list-style: none'>

                  <li>VOC: {{stats.totals.totalVoc}}</li>
                  <li>VMP: {{stats.totals.totalVmp}}</li>
                  <li>PMAX: {{stats.totals.totalPmax}}</li>
                  <li>ISC: {{stats.totals.totalIsc}}</li>
                  <li>IMP: {{stats.totals.totalImp}}</li>
                  <li>PANELS: {{stats.amountOfPanels}}</li>
                  <li>LINKS: {{stats.amountOfLinks}}</li>
                  <li>PANELS NOT IN LINK: {{stats.panelsNotInLink}}</li>
                </ul>
              </div>

            </ng-container>
          </div>


        </div>
      </ng-container>
    </div>
  `,
  styles: [],
  imports: [AsyncPipe, NgIf, StringStatsAsyncPipe, StringStatsAsyncPipe],
  standalone: true,
})
export class StringTotalsOverlayComponent {
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  selectedString$ = this.selectedFacade.selectedStringId$.pipe(
    switchMap(stringId => this.stringsFacade.stringById$(stringId).pipe(
      map(string => {
        if (!string) return undefined
        return string
      }),
    )),
  )

}
