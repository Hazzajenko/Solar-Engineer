import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { StringModel } from '../../../../../models/string.model'

interface DialogData {
  strings: StringModel[]
}

@Component({
  selector: 'app-select-string',
  templateUrl: './select-string.component.html',
  styleUrls: ['./select-string.component.scss'],
})
export class SelectStringComponent implements OnInit {
  selected!: StringModel

  constructor(
    public dialogRef: MatDialogRef<SelectStringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
