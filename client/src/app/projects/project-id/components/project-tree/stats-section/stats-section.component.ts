import { Component, Input, OnInit } from '@angular/core'
import { InverterModel } from '../../../../models/inverter.model'
import { TrackerModel } from '../../../../models/tracker.model'
import { StringModel } from '../../../../models/string.model'
import { StatsService } from '../../../../services/stats.service'
import { TypeModel } from '../../../../models/type.model'

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss'],
})
export class StatsSectionComponent implements OnInit {
  @Input() type?: TypeModel
  @Input() inverter?: InverterModel
  @Input() tracker?: TrackerModel
  @Input() string?: StringModel

  constructor(public stats: StatsService) {}

  ngOnInit(): void {}
}
