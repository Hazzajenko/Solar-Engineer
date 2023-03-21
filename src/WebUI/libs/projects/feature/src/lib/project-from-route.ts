import { inject } from '@angular/core'
import { ProjectsFacade } from '@projects/data-access'

export const projectFromRoute = () => {
  const projectsFacade = inject(ProjectsFacade)
  return projectsFacade.projectFromRoute$
}