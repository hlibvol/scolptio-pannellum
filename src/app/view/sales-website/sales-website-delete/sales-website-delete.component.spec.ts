import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWebsiteDeleteComponent } from './sales-website-delete.component';

describe('SalesWebsiteDeleteComponent', () => {
  let component: SalesWebsiteDeleteComponent;
  let fixture: ComponentFixture<SalesWebsiteDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWebsiteDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesWebsiteDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
