export interface NgrxEntityGeneratorSchema {
	project: string
	name: string
	pathFromRoot: string
	modelName: string
	modelPath: string
	// createAsNewLibrary: boolean
	// directory?: string
	// pathFromRoot?: string
	// useExistingModel: boolean
	// existingModelSchema?: NgrxEntityUseExistingModelGeneratorSchema
}

export interface NgrxEntityUseExistingModelGeneratorSchema {
	pathFromRoot: string
	modelName: string
	modelPath: string
}
