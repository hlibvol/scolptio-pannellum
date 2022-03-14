import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWebsiteGenerateComponent } from './sales-website-generate.component';

describe('SalesWebsiteGenerateComponent', () => {
  let component: SalesWebsiteGenerateComponent;
  let fixture: ComponentFixture<SalesWebsiteGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWebsiteGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesWebsiteGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
