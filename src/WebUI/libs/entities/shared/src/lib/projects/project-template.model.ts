import { environment } from '@shared/environment'

export type ProjectTemplatePreviewModel = {
	name: string
	description: string
	photoUrl: string
}
export const PROJECT_TEMPLATE: Record<string, ProjectTemplatePreviewModel> = {
	BLANK: {
		name: 'Blank',
		description: 'Blank project template with no strings or panels',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__blank.png`,
	},
	SIX_ROWS_OF_PANELS: {
		name: 'Six rows of panels',
		description: 'Blank project template with six rows of panels',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__6-rows-of-panels-no-strings.png`,
	},
	SIX_ROWS_OF_PANELS_IN_STRINGS: {
		name: 'Six rows of panels in strings',
		description: 'Blank project template with six rows of panels in strings',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__6-rows-of-panels-in-strings.png`,
	},
	SIX_ROWS_OF_PANELS_IN_STRINGS_AND_PANEL_LINKS: {
		name: 'Six rows of panels in strings and panel links',
		description: 'Blank project template with six rows of panels in strings with panel links',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__6-rows-of-panels-in-strings-with-panel-links.png`,
	},
} as const

export const PROJECT_TEMPLATES = Object.values(PROJECT_TEMPLATE)

export type ProjectTemplate = (typeof PROJECT_TEMPLATES)[number]
