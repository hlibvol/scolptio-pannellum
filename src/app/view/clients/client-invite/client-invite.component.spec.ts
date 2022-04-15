import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInviteComponent } from './client-invite.component';

describe('ClientInviteComponent', () => {
  let component: ClientInviteComponent;
  let fixture: ComponentFixture<ClientInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
