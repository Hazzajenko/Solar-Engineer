import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-create-string',
  templateUrl: './create-string.component.html',
  styleUrls: ['./create-string.component.scss'],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  standalone: true,
})
export class CreateStringComponent implements OnInit {
  name?: string

  constructor(public dialogRef: MatDialogRef<CreateStringComponent>) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
