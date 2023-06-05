/*
 public static class ModelType
 {
 public const string Panel = "Panel";
 public const string Inverter = "Inverter";
 public const string Cable = "Cable";
 public const string DisconnectionPoint = "DisconnectionPoint";
 public const string Tray = "Tray";
 public const string Rail = "Rail";
 public const string Tracker = "Tracker";
 public const string String = "String";
 public const string PanelLink = "PanelLink";
 public const string PanelConfig = "PanelConfig";
 public const string Undefined = "Undefined";
 }*/

// import { ENTITY_TYPE } from '@shared/data-access/models'

export const ProjectModelType = {
	PANEL: 'Panel',
	Inverter: 'Inverter',
	Cable: 'Cable',
	DisconnectionPoint: 'DisconnectionPoint',
	Tray: 'Tray',
	Rail: 'Rail',
	Tracker: 'Tracker',
	String: 'String',
	PanelLink: 'PanelLink',
	PanelConfig: 'PanelConfig',
	Undefined: 'Undefined',
}

export type ProjectModelType = (typeof ProjectModelType)[keyof typeof ProjectModelType]
