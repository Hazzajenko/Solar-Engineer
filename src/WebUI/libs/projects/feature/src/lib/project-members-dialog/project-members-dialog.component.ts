import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { BaseService } from '@shared/logger'
import { DialogService, GenerateUserDataPipe } from '@shared/utils'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ProjectModel } from '@shared/data-access/models'
import { ExcludeCurrentUserPipe } from '@shared/pipes'

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [CommonModule, GenerateUserDataPipe, ExcludeCurrentUserPipe],
  templateUrl: './project-members-dialog.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMembersDialogComponent extends BaseService {
  private dialogRef = inject(MatDialogRef<ProjectMembersDialogComponent>)
  private data = inject(MAT_DIALOG_DATA)
  public dialogService = inject(DialogService)
  // public project?: ProjectModel
  public project: ProjectModel = this.data.project
  // public members: UserModel[] = this.project.members
  /*  constructor(
   private dialogRef: MatDialogRef<ProjectMembersDialogComponent>,
   @Inject(MAT_DIALOG_DATA) data: { project: ProjectModel },
   ) {
   super()
   this.logDebug('data', data)
   this.project = data.project

   }*/
}
