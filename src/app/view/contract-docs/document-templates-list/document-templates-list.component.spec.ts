import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplatesListComponent } from './document-templates-list.component';

describe('DocumentTemplatesListComponent', () => {
  let component: DocumentTemplatesListComponent;
  let fixture: ComponentFixture<DocumentTemplatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTemplatesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
