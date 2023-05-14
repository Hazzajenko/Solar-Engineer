import { Component, inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { CanvasString } from '@entities/shared'

@Component({
	selector: 'app-view-string-component',
	templateUrl: 'view-string.component.html',
	standalone: true,
	imports: [AsyncPipe, NgForOf, NgIf],
})
export class ViewStringComponent implements OnInit {
	private dialogRef = inject(MatDialogRef<ViewStringComponent>)
	private data = inject(MAT_DIALOG_DATA)
	dataString: CanvasString = this.data.string

	ngOnInit(): void {
		console.log('string', this.dataString)
	}
}
