import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { combineLatestWith, firstValueFrom } from 'rxjs'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'

import { Store } from '@ngrx/store'

import { map } from 'rxjs/operators'

import { HttpClient } from '@angular/common/http'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppState } from '@shared/data-access/store'
import { PanelModel, StringModel } from '@shared/data-access/models'
import {
  PanelsEntityService,
  selectCurrentProjectId,
  selectSelectedState,
  StringsEntityService,
} from '@grid-layout/data-access/store'


@Component({
  selector: 'new-string-dialog',
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
      <button
        (click)="addSelectedToNewString()"
        [mat-dialog-close]="true"
        cdkFocusInitial
        mat-button
      >
        Create {{ name.value }}
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./new-string.dialog.scss'],
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
export class NewStringDialog implements OnInit {
  stringName: string = ''
  name = new FormControl('')
  private store = inject(Store<AppState>)
  private stringsEntity = inject(StringsEntityService)
  private panelsEntity = inject(PanelsEntityService)



  ngOnInit() {}

  async addSelectedToNewString() {
    const projectId = await firstValueFrom(this.store.select(selectCurrentProjectId))
    const selectedPanels = await firstValueFrom(
      this.store
        .select(selectSelectedState)
        .pipe(combineLatestWith(this.panelsEntity.entities$))
        .pipe(
          map(([selectedState, panels]) => {
            return panels.filter((p) => selectedState.multiSelectIds?.includes(p.id))
          }),
        ),
    )

    if (!selectedPanels) {
      return console.error('addSelectedToNewString, !selectedPanels')
    }
    if (!this.name.value) {
      return console.error('addSelectedToNewString, !this.name.value')
    }

    // const newStringId = Guid.create().toString()

    const newString = new StringModel(projectId, this.name.value, '#95c2fa')
    /*
          const newString: StringModel = {
            id: newStringId,
            name: this.name.value,
            color: 'blue',
            type: TypeModel.STRING,
          }*/

    this.stringsEntity.add(newString)

    const selectedPanelUpdates: Partial<PanelModel>[] = selectedPanels.map((panel) => {
      const partial: Partial<PanelModel> = {
        ...panel,
        stringId: newString.id,
      }
      return partial
    })

    this.panelsEntity.updateManyInCache(selectedPanelUpdates)
  }
}
