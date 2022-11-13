import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerStatsComponent } from './tracker-stats.component';

describe('TrackerStatsComponent', () => {
  let component: TrackerStatsComponent;
  let fixture: ComponentFixture<TrackerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackerStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
