import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GisMapsComponent } from './gis-maps.component';

describe('GisMapsComponent', () => {
  let component: GisMapsComponent;
  let fixture: ComponentFixture<GisMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GisMapsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GisMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
