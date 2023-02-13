import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'

@Component({
  selector: 'app-project-toolbar',
  templateUrl: 'project-toolbar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  styles: [],
})

export class ProjectToolbarComponent {

}