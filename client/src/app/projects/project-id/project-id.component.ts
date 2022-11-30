import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../store/app.state'
import { ProjectsService } from '../services/projects.service'
import { GridLayoutComponent } from './grid-layout/grid-layout.component'
import { AsyncPipe, CommonModule, NgIf } from '@angular/common'
import { GridToolbarComponent } from './grid-layout/grid-toolbar/grid-toolbar.component'
import { MatSliderModule } from '@angular/material/slider'
import { FormsModule } from '@angular/forms'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-project-id',
  templateUrl: './project-id.component.html',
  styleUrls: ['./project-id.component.scss'],
  standalone: true,
  imports: [
    GridLayoutComponent,
    NgIf,
    AsyncPipe,
    GridToolbarComponent,
    CommonModule,
    MatSliderModule,
    FormsModule,
    DragDropModule,
    MatButtonModule,
  ],
})
export class ProjectIdComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private projects: ProjectsService,
  ) {}

  ngOnInit(): void {}
}
