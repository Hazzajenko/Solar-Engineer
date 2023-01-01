import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { combineLatestWith, firstValueFrom, Observable } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { SelectedFacade, StringsFacade } from '@project-id/data-access/facades'
import { StringFactory } from '@grid-layout/data-access/utils'
import { StringPanelsAsyncPipe } from '../pipes/string-panels-async.pipe'
import { StringTotalsAsyncPipe } from '../pipes/string-totals-async.pipe'

/* eslint-disable @angular-eslint/component-class-suffix */
@Component({
  selector: 'app-view-strings-dialog',
  template: `
    <div class="container">
      <h1 mat-dialog-title>Strings</h1>
      <div mat-dialog-content>{{ (strings$ | async)?.length }} Total</div>
      <p>
        Option selected:
        {{
          strings.selectedOptions.hasValue()
            ? strings.selectedOptions.selected[0].value.name
            : 'None'
        }}
      </p>

      <mat-selection-list #strings [multiple]="false">
        <cdk-virtual-scroll-viewport appendOnly class="viewport" itemSize="5">
          <ng-container *cdkVirtualFor="let string of strings$ | async">
            <mat-list-option
              (click)="view(string)"
              [value]="string"
              class="viewport__mat-list-string"
            >
              {{ string.name }} [{{ string | stringPanelsAsync | async }} Panels]
            </mat-list-option>
            <ng-container *ngIf="showString === string.id">
              <div class="container__button-menu">
                <button (click)="selectString(string)" mat-icon-button>
                  <mat-icon>open_in_new</mat-icon>
                </button>
                <button mat-icon-button>
                  <mat-icon>settings</mat-icon>
                </button>
                <button (click)="deleteString(string)" mat-icon-button>
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
              <div class="container__string-info">
                <ng-container *ngIf="string | stringTotalsAsync | async as totals">
                  <div class="mat-typography">
                    <ul style="list-style: none">
                      <li>VOC: {{ totals.totalVoc }}</li>
                      <li>VMP: {{ totals.totalVmp }}</li>
                      <li>PMAX: {{ totals.totalPmax }}</li>
                      <li>ISC: {{ totals.totalIsc }}</li>
                      <li>IMP: {{ totals.totalImp }}</li>
                    </ul>
                  </div>
                </ng-container>
              </div>
            </ng-container>
          </ng-container>
        </cdk-virtual-scroll-viewport>
      </mat-selection-list>
    </div>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="true">Cancel</button>
      <button
        (click)="addSelectedToExistingString(strings.selectedOptions.selected[0].value)"
        [mat-dialog-close]="true"
        cdkFocusInitial
        mat-button
      >
        Select
        {{
          strings.selectedOptions.hasValue()
            ? strings.selectedOptions.selected[0].value.name
            : 'None'
        }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &__button-menu {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }

        &__string-info {
          padding-left: 15px;
        }
      }

      .typo-test {
        font-family: unquote('Roboto'), serif;
        font-size: 16px;
      }

      .viewport {
        height: 400px;
        width: 400px;

        &__mat-list-string {
          background-color: white;

          &:hover {
            background-color: #7bd5ff;
            //color: #38c1ff;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogModule,
    MatButtonModule,
    AsyncPipe,
    NgForOf,
    NgStyle,
    MatListModule,
    ScrollingModule,
    NgIf,
    MatIconModule,
    StringPanelsAsyncPipe,
    StringTotalsAsyncPipe,
  ],
  standalone: true,
})
export class ExistingStringsDialog {
  private stringsFacade = inject(StringsFacade)
  private selectedFacade = inject(SelectedFacade)
  private stringFactory = inject(StringFactory)
  strings$ = this.stringsFacade.stringsFromRoute$
  selectedStringId$ = this.selectedFacade.selectedStringId$
  show: string[] = []
  showString = ''

  view(stringId: string) {
    if (this.showString !== '') {
      if (this.showString !== stringId) {
        this.showString = stringId
      } else {
        this.showString = ''
      }
    } else {
      this.showString = stringId
    }
  }

  deleteString(stringId: string) {
    this.stringFactory.delete(stringId)
  }

  selectString(stringId: string) {
    this.stringFactory.select(stringId)
  }

  addSelectedToExistingString(stringId: string) {
    this.stringFactory.addSelectedToExisting(stringId)
  }
}
