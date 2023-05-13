import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/overlay";
import { DataWrapper } from "@shared/utils";

@Injectable({
	providedIn: "root",
})
export class DialogsService {
	private matDialog = inject(MatDialog);

	open<T, X>(component: ComponentType<T>, data?: DataWrapper<X>) {
		return this.matDialog.open(component, {
			width: "600px",
			position: {
				top: window.innerHeight / 2 + "px",
				left: window.innerWidth / 2 + "px",
			},

			data,
		});
	}

	close() {
		this.matDialog.closeAll();
	}
}