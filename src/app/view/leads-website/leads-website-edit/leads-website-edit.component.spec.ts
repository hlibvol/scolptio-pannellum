import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsWebsiteEditComponent } from './leads-website-edit.component';

describe('LeadsWebsiteEditComponent', () => {
  let component: LeadsWebsiteEditComponent;
  let fixture: ComponentFixture<LeadsWebsiteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsWebsiteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsWebsiteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
