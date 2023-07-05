import { DynamicNotificationModel } from '@auth/shared'
import { getGuid } from '@ngrx/data'

export const createDynamicNotification = (
	dynamicNotification: Omit<DynamicNotificationModel, 'id'>,
) =>
	({
		id: getGuid(),
		...dynamicNotification,
	} as DynamicNotificationModel)
