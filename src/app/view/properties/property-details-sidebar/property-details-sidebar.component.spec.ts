import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsSidebarComponent } from './property-details-sidebar.component';

describe('PropertyDetailsSidebarComponent', () => {
  let component: PropertyDetailsSidebarComponent;
  let fixture: ComponentFixture<PropertyDetailsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyDetailsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
