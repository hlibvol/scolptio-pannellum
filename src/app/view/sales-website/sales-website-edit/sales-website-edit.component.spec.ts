import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWebsiteEditComponent } from './sales-website-edit.component';

describe('SalesWebsiteEditComponent', () => {
  let component: SalesWebsiteEditComponent;
  let fixture: ComponentFixture<SalesWebsiteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWebsiteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesWebsiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
