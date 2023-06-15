export const pluralize = (word: string, count: number) => {
	if (count === 1) return word
	return word + 's'
}
