import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyPlannerComponent } from './county-planner.component';

describe('CountyPlannerComponent', () => {
  let component: CountyPlannerComponent;
  let fixture: ComponentFixture<CountyPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountyPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountyPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
