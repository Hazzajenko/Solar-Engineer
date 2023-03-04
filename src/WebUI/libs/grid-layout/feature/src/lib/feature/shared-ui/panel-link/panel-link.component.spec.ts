import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelLinkComponent } from './panel-link.component'

describe('PanelLinkComponent', () => {
  let component: PanelLinkComponent
  let fixture: ComponentFixture<PanelLinkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelLinkComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(PanelLinkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
