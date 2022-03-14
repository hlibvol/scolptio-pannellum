import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWebsiteListComponent } from './sales-website-list.component';

describe('SalesWebsiteListComponent', () => {
  let component: SalesWebsiteListComponent;
  let fixture: ComponentFixture<SalesWebsiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWebsiteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesWebsiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
