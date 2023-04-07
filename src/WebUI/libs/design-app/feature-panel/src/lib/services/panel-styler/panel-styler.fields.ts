import { PanelStyleState } from '../../types'
import { NearbyPanel } from './nearby-panel.model'

export abstract class PanelStylerFields {
  private _nearbyPanels: NearbyPanel[] = []
  protected get nearbyPanels(): NearbyPanel[] {
    return this._nearbyPanels
  }

  protected set nearbyPanels(value: NearbyPanel[]) {
    console.log('set nearbyPanels', value)
    this._nearbyPanels = value
  }

  private _panelStyleStates: PanelStyleState[] = []

  protected get panelStyleStates(): PanelStyleState[] {
    return this._panelStyleStates
  }

  protected set panelStyleStates(value: PanelStyleState[]) {
    this._panelStyleStates = value
  }

  protected pushToPanelStyleStates(panelStyleState: PanelStyleState) {
    this._panelStyleStates.push(panelStyleState)
  }

  protected updatePanelStyleState(id: string, changes: Partial<PanelStyleState>) {
    const index = this.panelStyleStates.findIndex((x) => x.id === id)
    if (index > -1) {
      this._panelStyleStates[index] = {
        ...this._panelStyleStates[index],
        ...changes,
      }
    }
  }

  protected getPanelStyleStateById(id: string): PanelStyleState | undefined {
    return this.panelStyleStates.find((x) => x.id === id)
  }
}