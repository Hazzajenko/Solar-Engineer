export const FreePanelUtil = {
  /*  width: 23,
   height: 18,*/
  /*  width: 32,
   height: 32,*/
  // rotation: () =>
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

export const PanelRotationConfig = {
  Default: 'portrait',
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const

export type PanelRotationConfig = (typeof PanelRotationConfig)[keyof typeof PanelRotationConfig]

// export const PanelRotationConfigArray = Object.values(PanelRotationConfig)
// export const
