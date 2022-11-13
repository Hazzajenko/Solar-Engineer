import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringStatsComponent } from './string-stats.component';

describe('StringStatsComponent', () => {
  let component: StringStatsComponent;
  let fixture: ComponentFixture<StringStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
