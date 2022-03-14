import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLockscreenComponent } from './auth-lockscreen.component';

describe('AuthLockscreenComponent', () => {
  let component: AuthLockscreenComponent;
  let fixture: ComponentFixture<AuthLockscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthLockscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLockscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
