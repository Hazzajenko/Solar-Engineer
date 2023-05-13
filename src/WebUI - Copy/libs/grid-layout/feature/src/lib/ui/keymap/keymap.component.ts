import { AsyncPipe, NgIf } from '@angular/common'
import { Component, inject } from '@angular/core'
import { GridSelectedFacade, GridSelectedStoreService, GridStoreService, GridStringsFacade } from '@grid-layout/data-access'
import { of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'

@Component({
  selector:   'app-keymap-overlay',
  template:   `
                <div
                  class='pointer-events-none absolute z-50 w-[400px]  transform -translate-x-1/2 -translate-y-1/7 bottom-10'
                >
                  <div class='bg-gray-400 pl-4'>
                    <h3>Keymap</h3>
                    <div>
                      <ul style='list-style: none'>
                        <li>S: Select String for Selected Panel</li>
                        <ng-container *ngIf='isStringSelected$ | async'>
                          <ng-container *ngIf='gridMode$ | async as gridMode'>
                            <ng-container *ngIf='gridMode === 3'>
                              <li>Left Click: Start/Finish Link</li>
                              <li>Hold Shift: To Continue Linking</li>
                              <li>L: Exit Link Mode</li>
                            </ng-container>
                          </ng-container>
                          <li>L: Select Link Mode</li>
                        </ng-container>
                        <!--            <li>C: Select Create Mode</li>-->
                        <li>X: Create String With Selected</li>
                        <li>Hold Alt: Drag/MultiSelect</li>
                        <li>R: Reset Zoom And Grid Position</li>
                        <li>Delete: Delete selected</li>
                        <li>Escape: Reset State</li>
                      </ul>
                    </div>
                  </div>
                </div>
              `,
  styles:     [],
  imports:    [AsyncPipe, NgIf],
  standalone: true,
})
export class KeymapOverlayComponent {
  private selectedFacade = inject(GridSelectedFacade)
  private selectedStore = inject(GridSelectedStoreService)
  private gridStore = inject(GridStoreService)
  private stringsFacade = inject(GridStringsFacade)
  isStringSelected$ = this.selectedStore.select.selectedStringId$.pipe(
    switchMap((stringId) => {
      if (!stringId) return of(false)
      return this.stringsFacade.stringById$(stringId)
        .pipe(map((string) => !!string))
    }),
  )
  gridMode$ = this.gridStore.select.gridMode$
}
