import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { InverterModel } from '../../../models/inverter.model';
import { TrackerModel } from '../../../models/tracker.model';
import { StringModel } from '../../../models/string.model';
import { PanelModel } from '../../../models/panel.model';
import { PanelsService } from '../../../services/panels.service';

interface GridPanel {
  location: string;
}

@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.scss'],
})
export class GridLayoutComponent implements OnInit {
  @Input() inverters?: InverterModel[];
  @Input() trackers?: TrackerModel[];
  @Input() strings?: StringModel[];
  @Input() panels?: PanelModel[];

  /*  panels: GridPanel[] = [
      { location: '14' },
      { location: '35' },
      { location: '74' },
      { location: '32' },
      { location: '96' },
    ];*/

  constructor(private panelsService: PanelsService) {}

  ngOnInit(): void {}

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  taskDrop(event: CdkDragDrop<PanelModel, any>) {
    console.log(event);
    moveItemInArray(this.panels!, event.previousIndex, event.currentIndex);
    console.log('previousIndex', event.previousIndex);
    console.log('currentIndex', event.currentIndex);
    console.log(event);
    console.log(event.item.data);
    console.log(event.item.data.stringId);

    const panel = event.item.data;
    const update: PanelModel = {
      id: panel.id,
      inverterId: panel.inverterId,
      trackerId: panel.trackerId,
      stringId: panel.stringId,
      location: event.container.id,
      version: panel.version,
    };

    this.panelsService.updatePanel(3, update).then((res) => console.log(res));
  }
}
