import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDeligenceComponent } from './due-deligence.component';

describe('DueDeligenceComponent', () => {
  let component: DueDeligenceComponent;
  let fixture: ComponentFixture<DueDeligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DueDeligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DueDeligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
