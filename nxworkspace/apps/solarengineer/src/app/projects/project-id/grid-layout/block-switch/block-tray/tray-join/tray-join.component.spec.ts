import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrayJoinComponent } from './tray-join.component'

describe('CableJoinComponent', () => {
  let component: TrayJoinComponent
  let fixture: ComponentFixture<TrayJoinComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrayJoinComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TrayJoinComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
