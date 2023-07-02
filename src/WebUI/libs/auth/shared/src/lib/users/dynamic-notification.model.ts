export type DynamicNotificationModel = {
	id: string
	photoUrl: string | undefined
	title: string
	subtitle: string | undefined
	message: string | undefined
	actionButton:
		| {
				text: string
				onClick: () => void
		  }
		| undefined
	dismissButton: {
		text: string
		onClick: (() => void) | undefined
	}
}
