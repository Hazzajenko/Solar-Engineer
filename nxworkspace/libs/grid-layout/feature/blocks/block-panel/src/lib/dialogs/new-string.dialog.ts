/* eslint-disable @angular-eslint/component-class-suffix */
import { inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { StringFactory } from '@grid-layout/data-access/utils'
import { StringModel } from '@shared/data-access/models'

@Component({
  selector: 'app-new-string-dialog',
  template: `
    <div class='flex flex-col items-center content-center'>
      <h1 mat-dialog-title>Create String</h1>
    </div>
    <form ngForm class='example-form'>
      <label for='name'>Name: </label>
      <input id='name' type='text' [formControl]='name' />
    </form>
    <mat-dialog-actions align='end'>
      <button mat-button mat-dialog-close='true'>Cancel</button>
      <button (click)='addSelectedToNew()' cdkFocusInitial mat-button>
        Create {{ name.value }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [],
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
  private dialogRef = inject(MatDialogRef<NewStringDialog>)

  async addSelectedToNew() {
    if (!this.name.value) return console.error('!this.name.value')
    const result = await this.stringFactory.addSelectedToNew(this.name.value)
    if (result instanceof StringModel) {
      this.dialogRef.close(result)
      return
    }
    this.dialogRef.close(undefined)
  }
}
