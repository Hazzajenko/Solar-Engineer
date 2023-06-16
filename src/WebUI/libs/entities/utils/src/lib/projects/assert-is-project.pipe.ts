import { Pipe, PipeTransform } from '@angular/core'
import { ProjectWebModel } from '@entities/shared'

@Pipe({
	name: 'assertIsProject',
	standalone: true,
})
export class AssertIsProjectPipe implements PipeTransform {
	transform(project: ProjectWebModel): ProjectWebModel {
		return project as ProjectWebModel
	}
}
