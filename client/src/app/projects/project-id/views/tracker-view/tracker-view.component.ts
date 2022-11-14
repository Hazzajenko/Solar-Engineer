import { Component, OnInit } from '@angular/core'
import { StatsService } from '../../../services/stats.service'

@Component({
  selector: 'app-tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss'],
})
export class TrackerViewComponent implements OnInit {
  panelAmount: number[] = []
  totalVoc: number[] = this.statsService.stringsTotalVoc
  totalVmp: number[] = this.statsService.stringsTotalVmp
  totalPmax: number[] = this.statsService.stringsTotalPmax
  totalIsc: number[] = this.statsService.stringsTotalIsc
  totalImp: number[] = this.statsService.stringsTotalImp

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {}
}
