import { Pipe, PipeTransform } from '@angular/core'
import { ProjectUserModel } from '@shared/data-access/models'

@Pipe({
  name: 'showAdditionalMembers',
  standalone: true,
})

export class ShowAdditionalMembersPipe implements PipeTransform {
  transform(projectUsers: ProjectUserModel[]): string {
    const projectUsersLength = projectUsers.length
    if (projectUsersLength < 4) {
      return ''
    }
    return `+${projectUsersLength - 4}`
  }
}