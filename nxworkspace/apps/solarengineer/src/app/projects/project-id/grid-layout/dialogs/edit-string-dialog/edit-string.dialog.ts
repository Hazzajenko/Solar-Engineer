import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { Observable } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'
import { StringTotalsAsyncPipe } from '../../grid-toolbar/string-totals-async.pipe'
import { StringsEntityService } from '../../../services/ngrx-data/strings-entity/strings-entity.service'
import { StringModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/string.model'
import { AppState } from '../../../../../store/app.state'
import { map } from 'rxjs/operators'
import { PanelsEntityService } from '../../../services/ngrx-data/panels-entity/panels-entity.service'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { WarmColor } from '../../../../../../../../../libs/shared/data-access/models/src/lib/color.model'

@Component({
  selector: 'edit-string-dialog',
  template: `
    <ng-container *ngIf="string$ | async as string">
      <div class="container">
        <h1 mat-dialog-title>Edit String {{ string.name }}</h1>
      </div>
      <form ngForm class="example-form">
        <label for="name">Name: </label>
        <input id="name" type="text" [placeholder]="string.name" [formControl]="name" />
        <mat-selection-list [multiple]="false" #colorSelection [formControl]="color">
          <mat-list-option
            [ngStyle]="{ 'background-color': color }"
            [value]="color"
            *ngFor="let color of colors"
          >
            {{ color }}
          </mat-list-option>
        </mat-selection-list>

        <!--      <mat-form-field class='example-full-width'>
          <mat-label>String Name</mat-label>
          <input matInput [(ngModel)]='stringName'/>
        </mat-form-field>-->
      </form>
      <p>
        Name: {{ name.value }} Color selected:
        {{
          colorSelection.selectedOptions.hasValue()
            ? colorSelection.selectedOptions.selected[0].value.toString()
            : 'None'
        }}
      </p>
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close="true">Cancel</button>
        <button (click)="updateString(string)" [mat-dialog-close]="true" cdkFocusInitial mat-button>
          Edit {{ name.value }}
        </button>
      </mat-dialog-actions>
    </ng-container>
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
    StringTotalsAsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class EditStringDialog implements OnInit {
  stringName: string = ''
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
  /*  <!--          Red = '#ED5565',
  Yellow = '#FFCE54',
  Orange = '#FC6E51',
  Green = '#A0D468',
  Aqua = '#48CFAD',
  Cyan = '#4FC1E9',
  Blue = '#5D9CEC',
  Purple = '#AC92EC',
  Pink = '#EC87C0',-->*/
  stringId?: string
  name = new FormControl('')
  color = new FormControl('')
  form!: FormGroup
  string$!: Observable<StringModel | undefined>

  // description:string;

  constructor(
    private stringsEntity: StringsEntityService,
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    // private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditStringDialog>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.stringId = data.stringId
  }

  ngOnInit() {
    this.string$ = this.stringsEntity.entities$.pipe(
      map((strings) => strings.find((string) => string.id === this.stringId)),
    )
  }

  save() {
    this.dialogRef.close(this.form.value)
  }

  close() {
    this.dialogRef.close()
  }

  async updateString(string: StringModel) {
    console.log(this.color.value)
    const update: Partial<StringModel> = {
      ...string,
      name: this.name.value ? this.name.value : string.name,
      color: this.color.value ? this.color.value[0] : string.color,
    }

    this.stringsEntity.update(update)

    this.dialogRef.close()
  }
}
