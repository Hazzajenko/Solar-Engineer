import { Pipe, PipeTransform } from '@angular/core'
import { ProjectUserModel } from '@shared/data-access/models'

@Pipe({
  name: 'excludeCurrentUser',
  standalone: true,
})

export class ExcludeCurrentUserPipe implements PipeTransform {
  transform(projectUsers: ProjectUserModel[], excludeCurrentUserId?: string): ProjectUserModel[] {
    return [...projectUsers].filter((projectUser) => projectUser.id !== excludeCurrentUserId)
  }
}