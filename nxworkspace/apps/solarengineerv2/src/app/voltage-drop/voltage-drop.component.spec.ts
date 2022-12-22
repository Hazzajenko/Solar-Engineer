import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VoltageDropComponent } from './voltage-drop.component'

describe('VoltageDropComponent', () => {
  let component: VoltageDropComponent
  let fixture: ComponentFixture<VoltageDropComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoltageDropComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(VoltageDropComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
