import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsEditComponent } from './listings-edit.component';

describe('ListingsEditComponent', () => {
  let component: ListingsEditComponent;
  let fixture: ComponentFixture<ListingsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
