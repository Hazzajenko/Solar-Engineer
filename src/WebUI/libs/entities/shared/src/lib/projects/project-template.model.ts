import { environment } from '@shared/environment'
import { PROJECT_TEMPLATE_TYPE } from './projects.contracts'

// export type ProjectTemplatePreviewModel = {
// 	name: string
// 	key: ProjectTemplateType
// 	description: string
// 	templateName: string
// 	photoUrl: string
// }

// export type ProjectTemplate__Blank = {
// 	name: typeof PROJECT_TEMPLATE_TYPE.BLANK,
// 	description: 'Blank project template with no strings or panels',
// 	templateName: 'template__blank',
// 	photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__blank.png`,
// }

// export type ProjectTemplateData = {
// 	[K in (typeof PROJECT_TEMPLATE_TYPE)[keyof typeof PROJECT_TEMPLATE_TYPE]]: ProjectTemplatePreviewModel
// }

export const PROJECT_TEMPLATE = {
	[PROJECT_TEMPLATE_TYPE.BLANK]: {
		name: 'Blank',
		key: PROJECT_TEMPLATE_TYPE.BLANK,
		description: 'Blank project template with no strings or panels',
		templateName: 'template__blank',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__blank.png`,
	},
	[PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_NO_STRINGS]: {
		name: 'Twelve rows of panels, no strings',
		key: PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_NO_STRINGS,
		description: 'Blank project template with twelve rows of panels, no strings',
		templateName: 'template__12-rows-no-strings',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-no-strings.png`,
	},
	[PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_SIX_STRINGS]: {
		name: 'Twelve rows of panels, six strings',
		key: PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_SIX_STRINGS,
		description: 'Blank project template with twelve rows of panels in six strings',
		templateName: 'template__12-rows-6-strings',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-6-strings.png`,
	},
	[PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_SIX_STRINGS_WITH_LINKS]: {
		name: 'Twelve rows of panels, six strings, panel links',
		key: PROJECT_TEMPLATE_TYPE.TWELVE_ROWS_SIX_STRINGS_WITH_LINKS,
		description: 'Blank project template with twelve rows of panels in six strings and panel links',
		templateName: 'template__12-rows-6-strings-with-links',
		photoUrl: `${environment.AZURE_STORAGE_URL}project-template-previews/template__12-rows-6-strings-with-links.png`,
	},
} as const

export const PROJECT_TEMPLATES = Object.values(PROJECT_TEMPLATE)

export type ProjectTemplate = (typeof PROJECT_TEMPLATES)[number]
/*// export type ProjectTemplate = (typeof PROJECT_TEMPLATES)[number]
 export type ProjectTemplateName = ProjectTemplate['name']
 export type ProjectTemplateNameFlatten = {
 [K in ProjectTemplate['name']]: ProjectTemplate['name']
 }

 export type ProjectTemplates = typeof PROJECT_TEMPLATES

 export type ProjectTemplatesFlatten = {
 [K in ProjectTemplate['templateName']]: ProjectTemplate
 }*/

// export type ProjectTemplateType = ProjectTemplate['templateName']
