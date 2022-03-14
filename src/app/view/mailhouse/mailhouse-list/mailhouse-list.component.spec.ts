import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailhouseListComponent } from './mailhouse-list.component';

describe('MailhouseListComponent', () => {
  let component: MailhouseListComponent;
  let fixture: ComponentFixture<MailhouseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailhouseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailhouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
