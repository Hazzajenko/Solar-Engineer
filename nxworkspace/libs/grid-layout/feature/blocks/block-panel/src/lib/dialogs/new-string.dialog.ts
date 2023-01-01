/* eslint-disable @angular-eslint/component-class-suffix */
import { inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { StringFactory } from '@grid-layout/data-access/utils'

@Component({
  selector: 'app-new-string-dialog',
  template: `
    <div class="container">
      <h1 mat-dialog-title>Create String</h1>
    </div>
    <form ngForm class="example-form">
      <label for="name">Name: </label>
      <input id="name" type="text" [formControl]="name" />
      <!--      <mat-form-field class='example-full-width'>
        <mat-label>String Name</mat-label>
        <input matInput [(ngModel)]='stringName'/>
      </mat-form-field>-->
    </form>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="true">Cancel</button>
      <button (click)="addSelectedToNew()" [mat-dialog-close]="true" cdkFocusInitial mat-button>
        Create {{ name.value }}
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
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class NewStringDialog {
  name = new FormControl('')
  private stringFactory = inject(StringFactory)

  async addSelectedToNew() {
    if (!this.name.value) return console.error('!this.name.value')
    this.stringFactory.addSelectedToNew(this.name.value)
  }
}
