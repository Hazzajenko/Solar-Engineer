import { Component, Input, OnInit } from '@angular/core';
import { ProjectModel } from '../models/project.model';

@Component({
  selector: 'app-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss'],
})
export class ProjectListItemComponent implements OnInit {
  @Input() project?: ProjectModel;

  constructor() {
    console.log(this.project);
  }

  ngOnInit(): void {
    console.log(this.project);
  }
}
