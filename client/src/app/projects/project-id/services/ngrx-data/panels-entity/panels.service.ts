import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { PanelModel } from '../../../../models/panel.model'
import { PanelsEntityService } from './panels-entity.service'

@Injectable({
  providedIn: 'root',
})
export class PanelsHelperService {
  panels$: Observable<PanelModel[]>

  constructor(private panelsEntity: PanelsEntityService) {
    this.panels$ = this.panelsEntity.entities$
  }

  public getBlocksFromIncludedArray(array: string[]) {
    return this.panels$.pipe(map((panels) => panels.filter((panel) => array.includes(panel.id!))))
  }

  httpPostPanel() {}

  createPanelWithDefaultValues(location: string, stringId: string, rotation: number) {
    // const panel: PanelModel
    let panel = new PanelModel(location, stringId, rotation)
    const create: PanelModel = {
      ...panel,
      name: 'Longi Himo555m',
      currentAtMaximumPower: 13.19,
      shortCircuitCurrent: 14.01,
      shortCircuitCurrentTemp: 0.05,
      maximumPower: 555,
      maximumPowerTemp: -0.34,
      voltageAtMaximumPower: 42.1,
      openCircuitVoltage: 49.95,
      openCircuitVoltageTemp: -0.265,
      length: 2256,
      weight: 1133,
      width: 27.2,
    }
    /*    panel.name = 'Longi Himo555m'
        panel.currentAtMaximumPower = 13.19
        panel.shortCircuitCurrent = 14.01
        panel.shortCircuitCurrentTemp = 0.05
        panel.maximumPower = 555
        panel.maximumPowerTemp = -0.34
        panel.voltageAtMaximumPower = 42.1
        panel.openCircuitVoltage = 49.95
        panel.openCircuitVoltageTemp = -0.265
        panel.length = 2256
        panel.weight = 1133
        panel.width = 27.2*/
    return create
  }
}
