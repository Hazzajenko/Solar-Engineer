import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { FriendsStoreService } from '@app/data-access/friends'
import { ChatroomsComponent } from '@app/feature/chatrooms'
import { FriendsComponent } from '@app/feature/friends'
import { AuthStoreService } from '@auth/data-access'

import { AuthUserModel, CombinedAppUserModel, IUserModel, S3ImageModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

import { delay, map, Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { UpdateDisplayPictureRequest, UsersService, UsersStoreService } from '@app/data-access/users'
import { ConnectionsStoreService } from '@app/data-access/connections'
import { GetCdnUrlStringPipe, GetFullUrlPipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { ImagesService } from '@app/data-access/images'
import { HttpClient } from '@angular/common/http'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { LetDirective } from '@ngrx/component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'app-change-display-picture-component',
  templateUrl: './change-display-picture.component.html',
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
    ShowHideComponent,
    NgClass,
    MatCardModule,
    NgSwitch,
    NgSwitchCase,
    DatePipe,
    MatTabsModule,
    FriendsComponent,
    ChatroomsComponent,
    TimeDifferenceFromNowPipe,
    GetFullUrlPipe,
    GetCdnUrlStringPipe,
    MatProgressBarModule,
    LetDirective,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  providers: [DatePipe],
})
export class ChangeDisplayPictureComponent {
  private authStore = inject(AuthStoreService)
  private friendsStore = inject(FriendsStoreService)
  private route = inject(ActivatedRoute)
  private usersStore = inject(UsersStoreService)
  private usersService = inject(UsersService)
  private connectionsStore = inject(ConnectionsStoreService)
  private imagesService = inject(ImagesService)
  private http = inject(HttpClient)
  isDialog$ = this.route.url.pipe(
    map((paths) => {
      return paths[0].path !== 'messages'
    }),
  )
  user$: Observable<AuthUserModel | undefined> = this.authStore.select.user$
  defaultImages$: Observable<S3ImageModel[]> = this.imagesService.defaultImages$.pipe(delay(1000))
  imagesLength$: Observable<number> = this.imagesService.defaultImages$.pipe(
    map((images) => images.length),
  )

  appUser$: Observable<CombinedAppUserModel> = this.usersStore.select.personalCombinedAppUser$

  selectedImage?: S3ImageModel
  loaded = 0
  allImagesLoaded = false

  // userProfile$: Observable<WebUserModel | undefined>

  constructor(
    private dialogRef: MatDialogRef<ChangeDisplayPictureComponent>,
    @Inject(MAT_DIALOG_DATA) data: { user: IUserModel },
  ) {
    // this.appUser$.subscribe((res) => console.log(res))
    // this.imagesService.defaultImages$.subscribe((res) => console.log(res))
    // this.imagesService.getDefaultImages().subscribe((res) => console.log(res))
    // this.http.get<GetImagesResponse>(`/services/images/default`).subscribe((res) => console.log(res))
  }

  selectImage(image: S3ImageModel) {
    this.selectedImage = image
  }

  loadedImage(images: S3ImageModel[]) {
    this.loaded++
    if (images.length == this.loaded) {
      //all images loaded
      this.allImagesLoaded = true
    }
  }

  updateProfileDp(userName: string) {
    if (!this.selectedImage) return
    const request: UpdateDisplayPictureRequest = {
      userName,
      image: this.selectedImage,
    }
    this.usersStore.dispatch.updateDisplayPicture(request)
    this.dialogRef.close()
  }
}
