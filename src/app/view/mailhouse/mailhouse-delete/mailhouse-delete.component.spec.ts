import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailhouseDeleteComponent } from './mailhouse-delete.component';

describe('MailhouseDeleteComponent', () => {
  let component: MailhouseDeleteComponent;
  let fixture: ComponentFixture<MailhouseDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailhouseDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailhouseDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
