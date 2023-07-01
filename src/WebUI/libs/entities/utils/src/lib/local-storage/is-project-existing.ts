import { PROJECT_LOCAL_STORAGE_MODEL } from '@entities/shared'

export const isProjectExisting = () => {
	return Object.keys(PROJECT_LOCAL_STORAGE_MODEL).every((key) => {
		return !!localStorage.getItem(key)
	})
}
