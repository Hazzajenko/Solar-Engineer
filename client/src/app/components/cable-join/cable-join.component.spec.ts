import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CableJoinComponent } from './cable-join.component';

describe('CableJoinComponent', () => {
  let component: CableJoinComponent;
  let fixture: ComponentFixture<CableJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CableJoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CableJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
