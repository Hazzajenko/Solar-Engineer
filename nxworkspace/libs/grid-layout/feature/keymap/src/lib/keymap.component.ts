import { AsyncPipe, NgIf } from '@angular/common'
import { Component, inject } from '@angular/core'
import { StringTotalsOverlayComponent } from '@grid-layout/feature/string-stats'
import { SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { StringStatsAsyncPipe } from 'libs/grid-layout/feature/string-stats/src/lib/string-stats-async.pipe'

import { Observable, switchMap } from 'rxjs'

import { map } from 'rxjs/operators'

@Component({
  selector: 'app-keymap-overlay',
  template: `
    <div class='pointer-events-none absolute z-50'>
      <div class='absolute top-[90%] left-[50%] width-[20%] bg-grey-400'>
        <h3> Keymap</h3>
        <div class='keymap__list'>
          <ul style='list-style: none'>
            <li>S: Select String for Selected Panel</li>
            <ng-container *ngIf='isStringSelected$ | async'>
              <li>L: Select Link Mode</li>
            </ng-container>
            <li>C: Select Create Mode</li>
            <li>Delete: Delete selected</li>
            <li>Escape: Reset State</li>
          </ul>
        </div>
      </div>
    </div>

  `,
  styles: [],
  imports: [AsyncPipe, NgIf, StringStatsAsyncPipe, StringStatsAsyncPipe],
  standalone: true,
})
export class KeymapOverlayComponent {
  private selectedFacade = inject(SelectedFacade)
  private stringsFacade = inject(StringsFacade)
  isStringSelected$ = this.selectedFacade.selectedStringId$.pipe(
    switchMap(stringId => this.stringsFacade.stringById$(stringId).pipe(
      map(string => !!string),
    )),
  )

}
