import { ProjectId, StringId } from '@entities/shared'

export type DialogInputTemplate = {
	component: DialogComponent
}

export const DIALOG_COMPONENT = {
	MOVE_PANELS_TO_STRING: 'MovePanelsToStringComponent',
	APP_SETTINGS: 'AppSettingsDialogComponent',
	PROFILE_SETTINGS: 'ProfileSettingsDialogComponent',
	SIGN_IN: 'SignInDialogComponent',
	CREATE_PROJECT: 'DialogCreateProjectComponent',
	DELETE_PROJECT_WARNING: 'DialogDeleteProjectWarningComponent',
	INVITE_TO_PROJECT_CONFIRM: 'DialogInviteToProjectConfirmComponent',
	CHANGE_STRING_COLOUR: 'DialogChangeStringColourComponent',
	SELECT_PROJECT: 'DialogSelectProjectComponent',
	SELECT_PROJECT_VIEW: 'DialogSelectProjectViewComponent',
} as const

export type DialogComponent = (typeof DIALOG_COMPONENT)[keyof typeof DIALOG_COMPONENT]

export type DialogInputMovePanelsToString = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.MOVE_PANELS_TO_STRING
	data: {
		panelIds: string[]
	}
}

export type DialogInputAppSettings = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.APP_SETTINGS
}

export type DialogInputProfileSettings = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.PROFILE_SETTINGS
}

export type DialogInputSignIn = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.SIGN_IN
}

export type DialogInputCreateProject = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.CREATE_PROJECT
}

export type DialogInputDeleteProjectWarning = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.DELETE_PROJECT_WARNING
	data: {
		projectId: ProjectId
	}
}

export type DialogInputInviteToProjectConfirm = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.INVITE_TO_PROJECT_CONFIRM
	data: {
		projectId: ProjectId
		userIdToInvite: string
	}
}

export type DialogInputChangeStringColour = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.CHANGE_STRING_COLOUR
	data: {
		stringId: StringId
	}
}

export type DialogInputSelectProject = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.SELECT_PROJECT
}

export type DialogInputSelectProjectView = DialogInputTemplate & {
	component: typeof DIALOG_COMPONENT.SELECT_PROJECT_VIEW
	data: {
		currentView: 'data' | 'members' | 'settings'
	}
}

export type DialogInput =
	| DialogInputMovePanelsToString
	| DialogInputAppSettings
	| DialogInputProfileSettings
	| DialogInputSignIn
	| DialogInputCreateProject
	| DialogInputDeleteProjectWarning
	| DialogInputInviteToProjectConfirm
	| DialogInputChangeStringColour
	| DialogInputSelectProject
	| DialogInputSelectProjectView
