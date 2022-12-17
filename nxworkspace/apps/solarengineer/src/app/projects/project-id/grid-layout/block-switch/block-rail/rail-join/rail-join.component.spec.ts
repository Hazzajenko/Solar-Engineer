import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RailJoinComponent } from './rail-join.component'

describe('CableJoinComponent', () => {
  let component: RailJoinComponent
  let fixture: ComponentFixture<RailJoinComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RailJoinComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(RailJoinComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
