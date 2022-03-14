import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingImageViewComponent } from './listing-image-view.component';

describe('ListingImageViewComponent', () => {
  let component: ListingImageViewComponent;
  let fixture: ComponentFixture<ListingImageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingImageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingImageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
