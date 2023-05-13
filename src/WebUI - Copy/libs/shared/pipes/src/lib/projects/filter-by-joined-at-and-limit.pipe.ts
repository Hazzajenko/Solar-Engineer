import { Pipe, PipeTransform } from '@angular/core'
import { ProjectUserModel } from '@shared/data-access/models'

@Pipe({
  name: 'filterByJoinedAtAndLimit',
  standalone: true,
})

export class FilterByJoinedAtAndLimitPipe implements PipeTransform {
  transform(projectUsers: ProjectUserModel[], take?: number, excludeCurrentUserId?: string): ProjectUserModel[] {
    const filtered = [...projectUsers].sort((a, b) => {
        return new Date(b.joinedAtTime).getTime() - new Date(a.joinedAtTime).getTime()
      },
    )
    if (excludeCurrentUserId) {
      if (take) {
        return filtered.slice(0, take).filter((projectUser) => projectUser.id !== excludeCurrentUserId)
      }
      return filtered.filter((projectUser) => projectUser.id !== excludeCurrentUserId)
      // return take ? filtered.slice(0, take).filter((projectUser) => projectUser.id !== excludeCurrentUserId) : filtered.filter((projectUser) => projectUser.id !== excludeCurrentUserId)
    }
    if (take) {
      return filtered.slice(0, take)
    }
    return filtered
    // return take ? filtered.slice(0, take) : filtered
  }
}