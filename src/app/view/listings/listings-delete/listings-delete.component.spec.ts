import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsDeleteComponent } from './listings-delete.component';

describe('ListingsDeleteComponent', () => {
  let component: ListingsDeleteComponent;
  let fixture: ComponentFixture<ListingsDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingsDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
