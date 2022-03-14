import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCopperComponent } from './ngx-copper.component';

describe('NgxCopperComponent', () => {
  let component: NgxCopperComponent;
  let fixture: ComponentFixture<NgxCopperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCopperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
