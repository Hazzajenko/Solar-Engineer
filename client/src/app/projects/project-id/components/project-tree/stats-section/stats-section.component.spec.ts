import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSectionComponent } from './stats-section.component';

describe('StatsSectionComponent', () => {
  let component: StatsSectionComponent;
  let fixture: ComponentFixture<StatsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
