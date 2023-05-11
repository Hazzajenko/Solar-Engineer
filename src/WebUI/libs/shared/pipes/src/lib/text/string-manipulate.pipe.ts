import { Pipe, PipeTransform } from '@angular/core'

export type StringManipulateCase = 'kebab' | 'snake' | 'camel' | 'pascal' | 'title'

@Pipe({
	name: 'stringManipulate',
	standalone: true,
})
export class StringManipulatePipe implements PipeTransform {
	transform(value: string, caseType: StringManipulateCase) {
		switch (caseType) {
			case 'kebab':
				return this.toKebabCase(value)
			case 'snake':
				return this.toSnakeCase(value)
			case 'camel':
				return this.toCamelCase(value)
			case 'pascal':
				return this.toPascalCase(value)
			case 'title':
				return this.screamingSnakeToTitleCase(value)
			// return this.toPascalCase(value).replace(/_/g, ' ')
			default:
				throw new Error(`Unknown case type: ${caseType}`)
		}
	}

	toKebabCase(value: string) {
		return value
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/\s+/g, '-')
			.toLowerCase()
	}

	toSnakeCase(value: string) {
		return value
			.replace(/([a-z])([A-Z])/g, '$1_$2')
			.replace(/\s+/g, '_')
			.toLowerCase()
	}

	toCamelCase(value: string) {
		return value
			.replace(/([a-z])([A-Z])/g, '$1$2')
			.replace(/\s+/g, '')
			.toLowerCase()
	}

	toPascalCase(value: string) {
		return value
			.replace(/([a-z])([A-Z])/g, '$1$2')
			.replace(/\s+/g, '')
			.toUpperCase()
	}

	screamingSnakeToTitleCase(str: string): string {
		const words = str.toLowerCase().split('_')
		const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		return capitalizedWords.join(' ')
	}
}
