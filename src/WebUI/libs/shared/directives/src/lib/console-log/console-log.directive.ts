import { Directive, Input } from '@angular/core'

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: '[consoleLog]', standalone: true })
export class ConsoleLogDirective {
	@Input({ required: true }) set consoleLog(objects: unknown[]) {
		console.log(...objects)
	}
}
