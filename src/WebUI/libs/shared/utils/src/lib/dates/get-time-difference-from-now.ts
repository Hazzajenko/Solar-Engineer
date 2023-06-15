export const getTimeDifferenceFromNow = (
	dateTime: string | undefined | null,
	format: 'Short' | 'Medium' = 'Short',
) => {
	if (!dateTime) return
	const now = Date.now()
	// const dateTimeDate = new Date(dateTime).getTime()
	const dateTimeDate = new Date(dateTime).getTime()

	let timeDifference = Math.abs(dateTimeDate - now) // take absolute value in case dateTimeDate is in the past

	const hours = Math.floor(timeDifference / 1000 / 60 / 60)
	timeDifference -= hours * 1000 * 60 * 60

	const minutes = Math.floor(timeDifference / 1000 / 60)

	console.log('Difference is: ', hours, 'hours and', minutes, 'minutes')

	// let timeDifference = dateTimeDate - now
	// const hours = Math.floor(timeDifference / 1000 / 60 / 60)
	timeDifference -= hours * 1000 * 60 * 60
	// const minutes = Math.floor(timeDifference / 1000 / 60)
	// const positiveHours = hours * -1

	if (hours > 24) {
		const days = Math.floor(hours / 24)
		const daysString = days === 1 ? 'Day' : 'Days'
		return `${days}${daysString}`
	}

	const hoursString = getHoursString(format, hours)
	const minutesString = getMinutesString(format, minutes)

	console.log('hours', hours)
	console.log('minutes', minutes)
	if (hours < 1) return `${minutes}${minutesString}`
	return `${hours}${hoursString}`
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
