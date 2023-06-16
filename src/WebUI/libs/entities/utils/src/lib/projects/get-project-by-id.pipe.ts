import { Pipe, PipeTransform } from '@angular/core'
import { ProjectWebModel } from '@entities/shared'

@Pipe({
	name: 'getProjectById',
	standalone: true,
})
export class GetProjectByIdPipe implements PipeTransform {
	transform(projects: ProjectWebModel[], projectId: string): ProjectWebModel | undefined {
		return projects.find((project: ProjectWebModel) => project.id === projectId)
	}
}
