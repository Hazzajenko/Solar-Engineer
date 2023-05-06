import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { DialogsService } from '@design-app/data-access'


@Component({
	selector: 'dialog-move-panels-to-string',
	templateUrl: 'move-panels-to-string.component.html',
	standalone: true,
	styles: [
		`
			:host {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				z-index: 50;
				position: absolute;
			}
		`,
	],
	imports: [AsyncPipe, NgForOf, NgIf, MatDialogModule, MatButtonModule],
})
export class MovePanelsToStringComponent implements OnInit {
	private dialogRef = inject(MatDialogRef<MovePanelsToStringComponent>)
	// private data = inject(MAT_DIALOG_DATA)
	dialogs = inject(DialogsService)
	// private _data = inject(MAT_DIALOG_DATA)
	panelIds: string[] = inject(MAT_DIALOG_DATA).panelIds

	ngOnInit(): void {
		console.log('panelIds', this.panelIds)
	}
}