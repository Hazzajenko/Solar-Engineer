import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


// import { DataWrapper } from '@design-app/data-access'

export type DataWrapper<T> = {
	[name: string]: T
}

@Injectable({
	providedIn: 'root',
})
export class DialogService {
	private matDialog = inject(MatDialog)

	open<T, X>(component: ComponentType<T>, data?: DataWrapper<X>) {
		return this.matDialog.open(component, {
			width: '600px',
			data,
		})
	}

	close() {
		this.matDialog.closeAll()
	}
}