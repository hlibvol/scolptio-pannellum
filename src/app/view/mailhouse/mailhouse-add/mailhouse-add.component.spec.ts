import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailhouseAddComponent } from './mailhouse-add.component';

describe('MailhouseAddComponent', () => {
  let component: MailhouseAddComponent;
  let fixture: ComponentFixture<MailhouseAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailhouseAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailhouseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
