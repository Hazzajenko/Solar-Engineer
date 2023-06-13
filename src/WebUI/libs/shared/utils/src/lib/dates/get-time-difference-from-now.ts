export const getTimeDifferenceFromNow = (
	dateTime: string | undefined | null,
	format: 'Short' | 'Medium' = 'Short',
) => {
	if (!dateTime) return
	const now = Date.now()
	const dateTimeDate = new Date(dateTime).getTime()

	let timeDifference = dateTimeDate - now
	const hours = Math.floor(timeDifference / 1000 / 60 / 60)
	timeDifference -= hours * 1000 * 60 * 60
	const minutes = Math.floor(timeDifference / 1000 / 60)
	const positiveHours = hours * -1

	// if (positiveHours > 24) return formatDate(dateTime, 'short', 'en-US')
	if (positiveHours > 24) {
		const days = Math.floor(positiveHours / 24)
		const daysString = days === 1 ? 'Day' : 'Days'
		return `${days}${daysString}`
	}

	const hoursString = getHoursString(format, positiveHours)
	const minutesString = getMinutesString(format, minutes)

	if (hours < 1) return `${minutes}${minutesString}`
	return `${positiveHours}${hoursString}`
}

const getHoursString = (format: 'Short' | 'Medium', hours: number) => {
	switch (format) {
		case 'Short':
			return hours === 1 ? 'hr' : 'hrs'
		case 'Medium':
			return hours === 1 ? 'hour' : 'hours'
		default:
			return hours === 1 ? 'hr' : 'hrs'
	}
}

const getMinutesString = (format: 'Short' | 'Medium', minutes: number) => {
	switch (format) {
		case 'Short':
			return minutes === 1 ? 'min' : 'mins'
		case 'Medium':
			return minutes === 1 ? 'minute' : 'minutes'
		default:
			return minutes === 1 ? 'min' : 'mins'
	}
}
