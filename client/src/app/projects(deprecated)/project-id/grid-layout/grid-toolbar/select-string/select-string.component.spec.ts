import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectStringComponent } from './select-string.component';

describe('SelectStringComponent', () => {
  let component: SelectStringComponent;
  let fixture: ComponentFixture<SelectStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectStringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
