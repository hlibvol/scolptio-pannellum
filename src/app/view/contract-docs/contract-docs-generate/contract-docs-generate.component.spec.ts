import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDocsGenerateComponent } from './contract-docs-generate.component';

describe('ContractDocsGenerateComponent', () => {
  let component: ContractDocsGenerateComponent;
  let fixture: ComponentFixture<ContractDocsGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDocsGenerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDocsGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
