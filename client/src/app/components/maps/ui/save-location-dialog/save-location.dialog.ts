import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'

import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MapsStore } from '../../data-access/maps.store'
import { ImageRequest } from '../../../../shared/models/images/image-request'
import { Observable, tap } from 'rxjs'
import { MatSliderModule } from '@angular/material/slider'

@Component({
  selector: 'new-string-dialog',
  templateUrl: 'save-location.dialog.html',
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
    MatSliderModule,
  ],
  standalone: true,
  providers: [MapsStore],
})
export class SaveLocationDialog {
  imgSrc: string = ''
  name = new FormControl('')
  uploadProgress?: number
  private store = inject(MapsStore)
  uploadingImage$: Observable<boolean> = this.store.uploadingImage$
  uploadProgress$: Observable<number | undefined> = this.store.uploadProgress$.pipe(
    tap((progress) => {
      this.uploadProgress = progress
    }),
  )

  constructor(
    private dialogRef: MatDialogRef<SaveLocationDialog>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.imgSrc = data.imgSrc
  }

  async saveImage() {
    if (!this.name.value) {
      return console.error('saveImage, !this.name.value')
    }
    const imageReq = new ImageRequest(this.imgSrc, this.name.value)

    this.store.uploadImageWithProgress(imageReq)
  }
}
