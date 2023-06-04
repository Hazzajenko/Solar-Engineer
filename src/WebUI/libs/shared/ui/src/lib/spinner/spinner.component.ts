import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
	selector: 'app-spinner',
	standalone: true,
	imports: [],
	templateUrl: './spinner.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
	@Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md'
	@Input() color: 'primary' | 'secondary' | 'accent' = 'primary'

	spinnerClass = `inline ${this.getSize(this.size)} mr-2 text-gray-200 animate-spin ${this.getColor(
		this.color,
	)}`

	// inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600
	private getSize(size: 'sm' | 'md' | 'lg' | 'xl') {
		switch (size) {
			case 'sm':
				return 'w-4 h-4'
			case 'md':
				return 'w-6 h-6'
			case 'lg':
				return 'w-8 h-8'
			case 'xl':
				return 'w-10 h-10'
		}
	}

	private getColor(color: 'primary' | 'secondary' | 'accent') {
		switch (color) {
			case 'primary':
				return 'fill-blue-600 dark:fill-blue-400'
			case 'secondary':
				return 'fill-gray-600 dark:fill-gray-400'
			case 'accent':
				return 'fill-green-600 dark:fill-green-400'
		}
		/*		switch (color) {
		 case 'primary':
		 return 'text-blue-600 dark:text-blue-400'
		 case 'secondary':
		 return 'text-gray-600 dark:text-gray-400'
		 case 'accent':
		 return 'text-green-600 dark:text-green-400'
		 }*/
	}
}
