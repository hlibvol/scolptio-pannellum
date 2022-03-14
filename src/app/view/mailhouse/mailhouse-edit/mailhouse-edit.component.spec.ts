import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailhouseEditComponent } from './mailhouse-edit.component';

describe('MailhouseEditComponent', () => {
  let component: MailhouseEditComponent;
  let fixture: ComponentFixture<MailhouseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailhouseEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailhouseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
