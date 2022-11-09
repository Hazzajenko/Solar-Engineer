import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface GridPanel {
  location: string;
}

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnInit {
  panels: GridPanel[] = [
    { location: '14' },
    { location: '35' },
    { location: '74' },
    { location: '32' },
    { location: '96' },
  ];

  constructor() {}

  ngOnInit(): void {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  taskDrop(event: CdkDragDrop<string, any>) {
    console.log(event);
  }
}
