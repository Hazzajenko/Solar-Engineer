import { LOCAL_NOTIFICATION_TYPE, LocalNotificationModel, WebUserModel } from '@auth/shared'
import { newGuid } from '@shared/utils'
import { ProjectModel } from '@entities/shared'

export const createLocalNotification__UserIsOnline = (user: WebUserModel) =>
	({
		id: newGuid(),
		notificationType: LOCAL_NOTIFICATION_TYPE.USER_IS_ONLINE,
		senderAppUserId: user.id,
		senderAppUserUserName: user.userName,
		senderAppUserDisplayName: user.displayName,
		senderAppUserPhotoUrl: user.photoUrl,
	} as LocalNotificationModel)

export const createLocalNotification__SelectedProject = (project: ProjectModel) =>
	({
		id: newGuid(),
		notificationType: LOCAL_NOTIFICATION_TYPE.SELECTED_PROJECT,
		projectId: project.id,
		projectName: project.name,
	} as LocalNotificationModel)

export const createLocalNotification__LoadedTemplate = (
	templateName: string,
	templatePhotoUrl: string,
) =>
	({
		id: newGuid(),
		notificationType: LOCAL_NOTIFICATION_TYPE.LOADED_TEMPLATE,
		templateName,
		templatePhotoUrl,
	} as LocalNotificationModel)

export const createLocalNotification__LoadedLocalSave = (localSaveLastModified: string) =>
	({
		id: newGuid(),
		notificationType: LOCAL_NOTIFICATION_TYPE.LOADED_LOCAL_SAVE,
		localSaveLastModified,
	} as LocalNotificationModel)

export const createLocalNotification = {
	userIsOnline: createLocalNotification__UserIsOnline,
	selectedProject: createLocalNotification__SelectedProject,
	loadedTemplate: createLocalNotification__LoadedTemplate,
	loadedLocalSave: createLocalNotification__LoadedLocalSave,
}
