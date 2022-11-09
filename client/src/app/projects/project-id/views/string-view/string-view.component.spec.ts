import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringViewComponent } from './string-view.component';

describe('StringViewComponent', () => {
  let component: StringViewComponent;
  let fixture: ComponentFixture<StringViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StringViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
