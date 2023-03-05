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

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { AuthFacade, AuthService } from '@auth/data-access'
import { StringsService } from '@grid-layout/data-access'
import { ProjectsStoreService } from '@projects/data-access'
import { ShowHideComponent } from '@shared/ui/show-hide'

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project.dialog.html',
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
export class CreateProjectDialog {
  projectForm: FormGroup = new FormGroup({
    projectName: new FormControl('', Validators.compose([Validators.required])),
  })

  private stringsFactory = inject(StringsService)
  private authService = inject(AuthService)
  private authFacade = inject(AuthFacade)
  private formBuilder = inject(FormBuilder)
  private projectsStore = inject(ProjectsStoreService)
  private dialogRef = inject(MatDialogRef<CreateProjectDialog>)
  validationMessages = {
    projectName: [{ type: 'required', message: 'Username is required.' }],
  }

  async onSubmit() {
    const projectName = this.projectForm.get('projectName')?.value
    // console.log(projectName)
    if (!projectName) return console.error('!this.projectName.value')
    this.projectsStore.dispatch.createWebProject(projectName)

    this.dialogRef.close(undefined)
  }
}
