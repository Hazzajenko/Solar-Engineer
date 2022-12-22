import { Pipe, PipeTransform } from '@angular/core'
import { ProjectModel } from '../../shared/models/projects/project.model'

@Pipe({
  name: 'oneProjectPipe',
  standalone: true
})

export class OneProjectPipe implements PipeTransform {
  transform(projects: ProjectModel[]): ProjectModel | undefined {
    if (!projects) return undefined

    console.log(projects)
    const proj = projects.find(x => x.id === 2)
    console.log(proj)

    return projects[0]
  }
}
