import generator from './generator'
import { NgrxEntityGeneratorSchema } from './schema'
import { readProjectConfiguration, Tree } from '@nx/devkit'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'

describe('ngrx-entity generator', () => {
	let tree: Tree
	const options: NgrxEntityGeneratorSchema = {
		name: 'test',
		pathFromRoot: 'libs/test',
		modelName: 'TestModel',
		modelPath: '@libs/test/models/test-model',
	}

	beforeEach(() => {
		tree = createTreeWithEmptyWorkspace()
	})

	it('should run successfully', async () => {
		await generator(tree, options)
		const config = readProjectConfiguration(tree, 'test')
		expect(config).toBeDefined()
	})
})