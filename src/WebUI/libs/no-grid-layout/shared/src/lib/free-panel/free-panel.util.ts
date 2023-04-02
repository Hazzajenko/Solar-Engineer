import { PanelRotationConfig } from './free-panel.config'


export const FreePanelUtil = {
  oppositeRotation: (rotation: PanelRotationConfig) => {
    switch (rotation) {
      case PanelRotationConfig.Portrait:
        return PanelRotationConfig.Landscape
      case PanelRotationConfig.Landscape:
        return PanelRotationConfig.Portrait
      default:
        return PanelRotationConfig.Portrait
    }
  },
  size: (rotation: PanelRotationConfig) => {
    switch (rotation) {
      case PanelRotationConfig.Portrait:
        return { width: 18, height: 23 }
      case PanelRotationConfig.Landscape:
        return { width: 23, height: 18 }
      default:
        return { width: 18, height: 23 }
    }
  },
} as const