export const PANELS_SIGNALR_METHOD = {
	CREATE_PANEL: 'CreatePanel',
	CREATE_MANY_PANELS: 'CreateManyPanels',
	UPDATE_PANEL: 'UpdatePanel',
	UPDATE_MANY_PANELS: 'UpdateManyPanels',
	DELETE_PANEL: 'DeletePanel',
	DELETE_MANY_PANELS: 'DeleteManyPanels',
} as const

export type PanelsSignalrMethod = (typeof PANELS_SIGNALR_METHOD)[keyof typeof PANELS_SIGNALR_METHOD]

export const PANELS_SIGNALR_EVENT = {
	PANEL_CREATED: 'PanelCreated',
	PANEL_UPDATED: 'PanelUpdated',
	PANEL_DELETED: 'PanelDeleted',
} as const

export type PanelsSignalrEvent = (typeof PANELS_SIGNALR_EVENT)[keyof typeof PANELS_SIGNALR_EVENT]
