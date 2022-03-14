import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesSettingsComponent } from './properties-settings.component';

describe('PropertiesSettingsComponent', () => {
  let component: PropertiesSettingsComponent;
  let fixture: ComponentFixture<PropertiesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
