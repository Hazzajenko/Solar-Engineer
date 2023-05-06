import { ComponentType } from '@angular/cdk/overlay'
import { inject, Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'


//
// export type DataWrapper<T> = { [name: string]: T }

// export type DataWrapper2<T> = { [name: string]: T }
export type DialogOptions = {
	height?: string
	width?: string
	position?: {
		top: string
		left: string
	}
}

@Injectable({
	providedIn: 'root',
})
export class DialogsService {
	private matDialog = inject(MatDialog)

	open<T>(component: ComponentType<T>, data?: unknown, options?: DialogOptions) {
		let height = '600px'
		let width = '600px'
		// let top = '100px'
		// let left = '100px'

		if (options) {
			options.height ? (height = options.height) : (height = '600px')
			options.width ? (width = options.width) : (width = '600px')
			// options.position ? top = options.position.top : top = '100px'
			// options.position ? left = options.position.left : left = '100px'
		}
		const top = (window.innerHeight - parseInt(height)) / 2 + 'px'
		const left = (window.innerWidth - parseInt(width)) / 2 + 'px'

		return this.matDialog.open(component, {
			// width: '600px'
			/*		position: {
			 top: window.innerHeight / 2 + "px",
			 left: window.innerWidth / 2 + "px",
			 },*/
			data,
			position: {
				top,
				left,
			},
			height,
			width,
		})
	}

	close() {
		this.matDialog.closeAll()
	}
}