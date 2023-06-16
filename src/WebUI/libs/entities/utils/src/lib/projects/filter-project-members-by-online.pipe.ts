import { Pipe, PipeTransform } from '@angular/core'
import { ProjectWebModel } from '@entities/shared'

@Pipe({
	name: 'filterProjectMembersByOnline',
	standalone: true,
})
export class FilterProjectMembersByOnlinePipe implements PipeTransform {
	transform(project: ProjectWebModel) {
		return project.members.filter((member) => member.isOnline)
	}
}
