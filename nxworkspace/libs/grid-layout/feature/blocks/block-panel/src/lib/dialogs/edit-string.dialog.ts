/* eslint-disable @angular-eslint/component-class-suffix */
import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'


import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'


import { map } from 'rxjs/operators'

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { StringFactory } from '@grid-layout/data-access/utils'
import { StringsFacade } from '@project-id/data-access/facades'
import { WarmColor } from '@shared/data-access/models'
import { StringTotalsAsyncPipe } from '../pipes/string-totals-async.pipe'

@Component({
  selector: 'app-edit-string-dialog',
  template: `
    <ng-container *ngIf='string$ | async as string'>
      <div class='container'>
        <h1 mat-dialog-title>Edit String {{ string.name }}</h1>
      </div>
      <form ngForm class='example-form'>
        <label for='name'>Name: </label>
        <input id='name' type='text' [placeholder]='string.name' [formControl]='name' />
        <mat-selection-list [multiple]='false' #colorSelection [formControl]='color'>
          <mat-list-option
            [ngStyle]="{ 'background-color': color }"
            [value]='color'
            *ngFor='let color of colors'
          >
            {{ color }}
          </mat-list-option>
        </mat-selection-list>

      </form>
      <p>
        Name: {{ name.value }} Color selected:
        {{
        colorSelection.selectedOptions.hasValue()
          ? colorSelection.selectedOptions.selected[0].value.toString()
          : 'None'
        }}
      </p>
      <mat-dialog-actions align='end'>
        <button mat-button mat-dialog-close='true'>Cancel</button>
        <button (click)='updateString(string.id)' [mat-dialog-close]='true' cdkFocusInitial mat-button>
          Edit {{ name.value }}
        </button>
      </mat-dialog-actions>
    </ng-container>
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
    StringTotalsAsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class EditStringDialog {
  colors: WarmColor[] = [
    WarmColor.Yellow,
    WarmColor.Orange,
    WarmColor.Green,
    WarmColor.Aqua,
    WarmColor.Cyan,
    WarmColor.Blue,
    WarmColor.Purple,
    WarmColor.Pink,
  ]
  stringId?: string
  name = new FormControl('')
  color = new FormControl('')
  form!: FormGroup
  private stringsFacade = inject(StringsFacade)
  private stringFactory = inject(StringFactory)


  constructor(
    private dialogRef: MatDialogRef<EditStringDialog>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.stringId = data.stringId
  }

  string$ = this.stringsFacade.allStrings$.pipe(
    map((strings) => strings.find((string) => string.id === this.stringId)),
  )

  save() {
    this.dialogRef.close(this.form.value)
  }

  close() {
    this.dialogRef.close()
  }

  async updateString(stringId: string) {
    this.stringFactory.updateString(stringId, {
      name: this.name.value ? this.name.value : undefined,
      color: this.color.value ? this.color.value : undefined,
    })

    this.dialogRef.close()
  }
}
