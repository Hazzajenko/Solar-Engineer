/* eslint-disable @angular-eslint/component-class-suffix */
import { Inject, inject } from '@angular/core'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'

import { ScrollingModule } from '@angular/cdk/scrolling'
import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { MatListModule } from '@angular/material/list'

import { MatIconModule } from '@angular/material/icon'

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthService } from '@auth/data-access/api'
import { AuthFacade, AuthStoreService } from '@auth/data-access/facades'
import { StringsService } from '@grid-layout/data-access/services'

import { StringModel } from '@shared/data-access/models'
import { ShowHideComponent } from '@shared/ui/show-hide'

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth.dialog.html',
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
  ],
  standalone: true,
})
export class AuthDialog {

  loginForm: FormGroup = new FormGroup({
    'username': new FormControl('', Validators.compose([
      Validators.required,
    ])),
    'password': new FormControl('', Validators.compose([
      Validators.minLength(5),
      Validators.required,
    ])),
  })
  loading = false

  submitted = false
  name = new FormControl('')
  password = new FormControl('')
  private stringsFactory = inject(StringsService)
  private authService = inject(AuthService)
  private authFacade = inject(AuthFacade)
  private authStore = inject(AuthStoreService)
  private formBuilder = inject(FormBuilder)
  form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })
  validationMessages = {
    'username': [
      { type: 'required', message: 'Username is required.' },
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
    ],
  }
  login = true

  constructor(
    private dialogRef: MatDialogRef<AuthDialog>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.login = data.login
  }

  get f() {
    return this.form.controls
  }

  async onSubmit() {
    const username = this.loginForm.get('username')?.value
    const password = this.loginForm.get('password')?.value
    console.log(username, password)
    if (!username) return console.error('!this.name.value')
    if (!password) return console.error('!this.password.value')
    // this.authFacade.register({ username, password })
    if (this.login) {
      // await this.authService.login({ username, password })
      this.authStore.dispatch.init({ username, password })
    } else {
      // await this.authService.register({ username, password })
      this.authStore.dispatch.register({ username, password })
    }
    // const result = await this.authService.addSelectedToNew(this.name.value)
    // if (result instanceof StringModel) {
    //   this.dialogRef.close(result)
    //   return
    // }
    this.dialogRef.close(undefined)
  }
}
