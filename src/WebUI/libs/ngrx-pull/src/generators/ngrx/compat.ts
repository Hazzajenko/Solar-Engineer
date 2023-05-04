// import { warnForSchematicUsage } from '../utils/warn-for-schematic-usage';
import { ngrxGenerator } from './ngrx'
import { convertNxGenerator } from '@nx/devkit'

export default warnForSchematicUsage(convertNxGenerator(ngrxGenerator))

function warnForSchematicUsage<T>(convertedGenerator: T): T {
	console.warn(
		'Running generators as schematics is deprecated and will be removed in v17. Prefer `callRule(convertNxGenerator(generator)(options), tree, context)` where "generator" is the name of the generator you wish to use.',
	)

	return convertedGenerator
}
