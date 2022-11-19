import { Component, Input, OnInit } from '@angular/core'
import { InverterModel } from '../../../../models/inverter.model'
import { TrackerModel } from '../../../../models/tracker.model'
import { StringModel } from '../../../../models/string.model'
import { PanelModel } from '../../../../models/panel.model'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { OldGridService } from '../../../../services/old-grid.service'

@Component({
  selector: 'app-grid-inventory',
  templateUrl: './grid-inventory.component.html',
  styleUrls: ['./grid-inventory.component.scss'],
})
export class GridInventoryComponent implements OnInit {
  @Input() inverters?: InverterModel[]
  @Input() trackers?: TrackerModel[]
  @Input() strings?: StringModel[] = []
  @Input() panels?: PanelModel[] = []
  @Input() selectedStringId?: number
  gridNumbers: string[] = []

  constructor(public grid: OldGridService) {}

  ngOnInit(): void {
    this.gridNumbers = this.grid.getNumbers(100)
  }

  taskDrop(event: CdkDragDrop<any, any>) {}
}
