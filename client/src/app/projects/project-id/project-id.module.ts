import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProjectIdRoutingModule } from './project-id-routing.module'

/*
const entityMetadata: EntityMetadataMap = {
  Panel: {},
}
*/

@NgModule({
  declarations: [],
  imports: [CommonModule, ProjectIdRoutingModule],
})
export class ProjectIdModule {
  /*  constructor(private eds: EntityDefinitionService) {
      eds.registerMetadataMap(entityMetadata)
    }*/
}
