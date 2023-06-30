import { environment } from '@shared/environment'

export type ProjectTemplatePreviewModel = {
	name: string
	description: string
	photoUrl: string
}
export const PROJECT_TEMPLATE = {
	BLANK: {
		name: 'Blank',
		description: 'Blank project template with no strings or panels',
		templateName: 'template__blank',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__blank.png`,
	},
	TWELVE_ROWS_OF_PANELS_NO_STRING: {
		name: 'Twelve rows of panels, no strings',
		description: 'Blank project template with twelve rows of panels, no strings',
		templateName: 'template__12-rows-no-strings',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-no-strings.png`,
	},
	TWELVE_ROWS_OF_PANELS_SIX_STRINGS: {
		name: 'Twelve rows of panels, six strings',
		description: 'Blank project template with twelve rows of panels in six strings',
		templateName: 'template__12-rows-6-strings',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-6-strings.png`,
	},
	TWELVE_ROWS_OF_PANELS_SIX_STRINGS_AND_PANEL_LINKS: {
		name: 'Twelve rows of panels, six strings, panel links',
		description: 'Blank project template with twelve rows of panels in six strings and panel links',
		templateName: 'template__12-rows-6-strings-with-links',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-6-strings-with-links.png`,
	},
} as const

export const PROJECT_TEMPLATES = Object.values(PROJECT_TEMPLATE)

export type ProjectTemplate = (typeof PROJECT_TEMPLATES)[number]
