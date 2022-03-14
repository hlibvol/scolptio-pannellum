import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsWebsiteAddComponent } from './leads-website-add.component';

describe('LeadsWebsiteAddComponent', () => {
  let component: LeadsWebsiteAddComponent;
  let fixture: ComponentFixture<LeadsWebsiteAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadsWebsiteAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsWebsiteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
