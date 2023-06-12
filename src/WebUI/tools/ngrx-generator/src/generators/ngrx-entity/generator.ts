import { NgrxEntityGeneratorSchema } from './schema'
import { formatFiles, generateFiles, Tree } from '@nx/devkit'
import { StringBuilder } from 'libs/shared/utils/src'
import * as path from 'path'

export default async function (tree: Tree, options: NgrxEntityGeneratorSchema) {
	// const projectRoot = `libs/${options.name}`
	/*	const projectRoot = options.createAsNewLibrary
	 ? `libs/${options.directory}/${options.name}`
	 : `libs/${options.directory}`
	 if (options.createAsNewLibrary) {
	 // options.directory = options.directory || options.name
	 // projectRoot = `${options.directory}/${options.name}`
	 // const projectRoot = `libs/${options.directory}/${options.name}`
	 // const projectRoot = `libs/${options.name}`
	 addProjectConfiguration(tree, options.name, {
	 root: projectRoot,
	 projectType: 'library',
	 sourceRoot: `${projectRoot}/src`,
	 targets: {},
	 })
	 }*/

	/*	addProjectConfiguration(tree, options.name, {
	 root: projectRoot,
	 projectType: 'library',
	 sourceRoot: `${projectRoot}/src`,
	 targets: {},
	 })*/

	const lowerCaseName = options.name.toLowerCase()
	const lowerCasePluralName = lowerCaseName + 's'
	const camelCaseName =
		options.name[0].toLowerCase() +
		options.name.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase()).slice(1)
	// const camelCaseName = options.name.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase())[0].toLowerCase() + options.name.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase()).slice(1)
	const camelCasePluralName = camelCaseName + 's'
	const pluralName = options.name + 's'
	const kebabCaseName = options.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
	const pascalCaseName = options.name.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase())
	const pascalPluralName = pluralName.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase())

	const projectRoot = options.pathFromRoot
	const modelName = options.modelName
	// const modelName = 'TestModel'
	const modelImportPath = options.modelPath
	// const modelImportPath = `@${projectRoot}/models/${modelName}`

	/*	const forLoop = `for (let i = 0; i < ${lowerCasePluralName}.length; i++) {
	 const ${lowerCaseName} = ${lowerCasePluralName}[i]
	 ${lowerCaseName}.id = i + 1
	 ${lowerCasePluralName}[i] = ${lowerCaseName}
	 }`*/

	const forLoop = new StringBuilder()
	forLoop.appendLine('for (let i = 0; i < ${lowerCasePluralName}.length; i++) {')
	forLoop.appendLine('const ${lowerCaseName} = ${lowerCasePluralName}[i]')
	forLoop.appendLine('${lowerCaseName}.id = i + 1')
	forLoop.appendLine('${lowerCasePluralName}[i] = ${lowerCaseName}')
	forLoop.appendLine('}')

	const substitutions = {
		name: options.name,
		modelName,
		modelImportPath,
		lowerCaseName,
		lowerCasePluralName,
		camelCaseName,
		camelCasePluralName,
		pluralName,
		kebabCaseName,
		pascalCaseName,
		pascalPluralName,
		forLoop,
	}

	generateFiles(tree, path.join(__dirname, 'files'), projectRoot, substitutions)
	await formatFiles(tree)
}
