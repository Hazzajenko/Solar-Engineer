import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BlockPanelComponent } from './block-panel.component'

describe('BlockPanelComponent', () => {
  let component: BlockPanelComponent
  let fixture: ComponentFixture<BlockPanelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockPanelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(BlockPanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
