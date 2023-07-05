import { NotificationModel, NotificationWithProjectInvite } from '@auth/shared'

export const isProjectNotification = (
	notification: NotificationModel,
): notification is NotificationWithProjectInvite => {
	return 'projectInvite' in notification && 'projectId' in notification
}

export const assertIsProjectNotification = (
	notification: unknown,
): asserts notification is NotificationWithProjectInvite => {
	if (typeof notification !== 'object' || notification === null)
		throw new Error(JSON.stringify(notification, null, '\t'))
	if (!('projectInvite' in notification && 'projectId' in notification))
		throw new Error(JSON.stringify(notification, null, '\t'))
}
