import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogsService } from "@design-app/data-access";
import { CanvasString } from "@design-app/shared";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";

@Component({
	selector: "app-view-string-component",
	templateUrl: "view-string.component.html",
	standalone: true,
	imports: [
		AsyncPipe,
		NgForOf,
		NgIf,
	],
})
export class ViewStringComponent implements OnInit {
	private dialogRef = inject(MatDialogRef<ViewStringComponent>);
	private data = inject(MAT_DIALOG_DATA);
	dialogs = inject(DialogsService);
	dataString: CanvasString = this.data.string;

	ngOnInit(): void {
		console.log("string", this.dataString);
	}
}