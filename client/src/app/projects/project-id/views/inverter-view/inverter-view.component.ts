import { Component, Input, OnInit } from '@angular/core';
import { InverterModel } from '../../../models/inverter.model';

@Component({
  selector: 'app-inverter-view',
  templateUrl: './inverter-view.component.html',
  styleUrls: ['./inverter-view.component.scss'],
})
export class InverterViewComponent implements OnInit {
  @Input() inverter?: InverterModel;

  constructor() {}

  ngOnInit(): void {}
}
