import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ProjectIdRoutingModule } from './project-id-routing.module'
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'

/*
const entityMetadata: EntityMetadataMap = {
  Panel: {},
}
*/

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProjectIdRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
  ],
})
export class ProjectIdModule {
  /*  constructor(private eds: EntityDefinitionService) {
      eds.registerMetadataMap(entityMetadata)
    }*/
}
