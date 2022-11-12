import { Component, Input, OnInit } from '@angular/core'
import { StringModel } from '../../../models/string.model'
import { PanelModel } from '../../../models/panel.model'
import { ProjectModel } from '../../../models/project.model'
import { InverterModel } from '../../../models/inverter.model'
import { TrackerModel } from '../../../models/tracker.model'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { GridService } from '../../../services/grid.service'

@Component({
  selector: 'app-tracker-tree',
  templateUrl: './tracker-tree.component.html',
  styleUrls: ['./tracker-tree.component.scss'],
})
export class TrackerTreeComponent implements OnInit {
  @Input() project?: ProjectModel
  @Input() inverter?: InverterModel
  @Input() tracker?: TrackerModel
  @Input() strings?: StringModel[]
  @Input() panels?: PanelModel[]
  gridNumbers: string[] = []
  stringBool: boolean[] = [false, false, false]

  constructor(public grid: GridService) {}

  ngOnInit(): void {
    this.gridNumbers = this.grid.getNumbers(100)
  }

  toggleString(stringModel: StringModel, index: number) {
    this.stringBool[index] = !this.stringBool[index]
    console.log(this.stringBool[index])
  }

  taskDrop(event: CdkDragDrop<any, any>) {
    console.log(event)
  }
}
