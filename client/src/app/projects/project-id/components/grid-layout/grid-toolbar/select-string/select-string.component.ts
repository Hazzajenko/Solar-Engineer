import { Component, Inject, OnInit } from '@angular/core'
import { StringModel } from '../../../../../models/string.model'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { NgForOf } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'

interface DialogData {
  strings: StringModel[]
}

@Component({
  selector: 'app-select-string',
  templateUrl: './select-string.component.html',
  styleUrls: ['./select-string.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgForOf,
    MatDialogModule,
    MatButtonModule,
  ],
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
