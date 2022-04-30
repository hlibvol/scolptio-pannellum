import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppBannerComponent } from './mobile-app-banner.component';

describe('MobileAppBannerComponent', () => {
  let component: MobileAppBannerComponent;
  let fixture: ComponentFixture<MobileAppBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAppBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
