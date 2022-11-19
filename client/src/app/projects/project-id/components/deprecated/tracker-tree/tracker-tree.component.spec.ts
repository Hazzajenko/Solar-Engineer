import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackerTreeComponent } from "./tracker-tree.component";

describe("TrackerTreeComponent", () => {
	let component: TrackerTreeComponent;
	let fixture: ComponentFixture<TrackerTreeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TrackerTreeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TrackerTreeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
