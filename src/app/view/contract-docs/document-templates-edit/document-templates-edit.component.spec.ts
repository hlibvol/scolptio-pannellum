import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTemplatesEditComponent } from './document-templates-edit.component';

describe('DocumentTemplatesEditComponent', () => {
  let component: DocumentTemplatesEditComponent;
  let fixture: ComponentFixture<DocumentTemplatesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTemplatesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplatesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
