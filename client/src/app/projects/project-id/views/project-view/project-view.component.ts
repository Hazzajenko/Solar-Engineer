import { Component, Input, OnInit } from '@angular/core';
import { ProjectStore } from '../../project-id.component';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {
  @Input() store?: ProjectStore;

  constructor() {}

  ngOnInit(): void {}
}
