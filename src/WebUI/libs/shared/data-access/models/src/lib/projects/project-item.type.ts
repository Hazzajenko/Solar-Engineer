export const PROJECT_ITEM_TYPE = {
  UNDEFINED: 'Undefined',
  INVERTER: 'Inverter',
  PANEL: 'Panel',
  CABLE: 'Cable',
  DISCONNECTIONPOINT: 'DisconnectionPoint',
  TRAY: 'Tray',
  RAIL: 'Rail',
  TRACKER: 'Tracker',
  STRING: 'String',
  PANEL_LINK: 'PanelLink',
  PANEL_CONFIG: 'PanelConfig',
} as const

export type ProjectItemType = (typeof PROJECT_ITEM_TYPE)[keyof typeof PROJECT_ITEM_TYPE]
