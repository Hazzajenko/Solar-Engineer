export interface CreatePanelRequest {
  id: string
  projectId: string
  stringId: string
  location: string
  panelConfigId: string | undefined
  rotation: number
}
