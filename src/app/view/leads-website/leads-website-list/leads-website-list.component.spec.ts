import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsWebsiteListComponent } from './leads-website-list.component';

describe('LeadsWebsiteListComponent', () => {
  let component: LeadsWebsiteListComponent;
  let fixture: ComponentFixture<LeadsWebsiteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsWebsiteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsWebsiteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
