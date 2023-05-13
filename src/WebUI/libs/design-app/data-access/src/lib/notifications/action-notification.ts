export type ActionNotificationModel = {
	id: string
	title: string
	isOpen: boolean
	message?: string
	type?: 'success' | 'error' | 'info' | 'warning'
	duration?: number
	buttons?: {
		text: string
		action: () => void
	}[]
}

export const DEFAULT_NOTIFICATION_DURATION = 5000
export const DEFAULT_NOTIFICATION_TYPE = 'info'
