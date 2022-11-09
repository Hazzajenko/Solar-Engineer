import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InverterViewComponent } from './inverter-view.component';

describe('InverterViewComponent', () => {
  let component: InverterViewComponent;
  let fixture: ComponentFixture<InverterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InverterViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InverterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
