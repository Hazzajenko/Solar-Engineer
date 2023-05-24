import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { BaseService } from '@shared/logger'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ProjectsSignalrService } from '@projects/data-access'
import { MatIconModule } from '@angular/material/icon'
import { CreateRangePipe } from '@shared/utils'

@Component({
  selector: 'app-create-project-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, CreateRangePipe],
  templateUrl: './create-project-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectDialogComponent extends BaseService {
  private matDialog = inject(MatDialog)
  private projectsSignalr = inject(ProjectsSignalrService)
  projectForm: FormGroup = new FormGroup({
    projectName: new FormControl('', Validators.compose([Validators.required])),
  })
  validationMessages = {
    projectName: [{ type: 'required', message: 'Project Name is required.' }],
  }

  onSubmit() {
    const projectName = this.projectForm.get('projectName')?.value
    this.logDebug('projectName', projectName)
    if (!projectName) return this.logError('!this.projectName.value', projectName)
    this.projectsSignalr.createProject(projectName)
    this.close()
  }

  close() {
    this.matDialog.closeAll()
  }
}