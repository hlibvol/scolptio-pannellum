import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsStatusComponent } from './property-details-status.component';

describe('PropertyDetailsStatusComponent', () => {
  let component: PropertyDetailsStatusComponent;
  let fixture: ComponentFixture<PropertyDetailsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDetailsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
