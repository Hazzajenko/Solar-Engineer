export const getTimeDifferenceFromNow = (
	dateTime: string | undefined | null,
	format: 'short' | 'medium' = 'short',
	withAgo = false,
) => {
	if (!dateTime) return
	const now = Date.now()
	const dateTimeDate = new Date(dateTime).getTime()
	let timeDifference = Math.abs(dateTimeDate - now)
	const hours = Math.floor(timeDifference / 1000 / 60 / 60)
	timeDifference -= hours * 1000 * 60 * 60
	const minutes = Math.floor(timeDifference / 1000 / 60)

	if (hours > 24) {
		const days = Math.floor(hours / 24)
		const daysString = days === 1 ? 'Day' : 'Days'
		if (withAgo) return `${days} ${daysString} ago`
		return `${days} ${daysString}`
	}

	const hoursString = getHoursString(format, hours)
	const minutesString = getMinutesString(format, minutes)
	if (hours < 1) {
		if (withAgo) return `${minutes}${minutesString} ago`
		return `${minutes}${minutesString}`
	}
	if (withAgo) return `${hours}${hoursString} ago`
	return `${hours}${hoursString}`
}

const getHoursString = (format: 'short' | 'medium', hours: number) => {
	switch (format) {
		case 'short':
			return hours === 1 ? 'hr' : 'hrs'
		case 'medium':
			return hours === 1 ? 'hour' : 'hours'
		default:
			return hours === 1 ? 'hr' : 'hrs'
	}
}

const getMinutesString = (format: 'short' | 'medium', minutes: number) => {
	switch (format) {
		case 'short':
			return minutes === 1 ? 'min' : 'mins'
		case 'medium':
			return minutes === 1 ? 'minute' : 'minutes'
		default:
			return minutes === 1 ? 'min' : 'mins'
	}
}
