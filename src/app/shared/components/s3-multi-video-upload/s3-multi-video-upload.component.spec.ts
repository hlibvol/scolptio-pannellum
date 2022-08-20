import { ComponentFixture, TestBed } from '@angular/core/testing';

import { S3MultiVideoUploadComponent } from './s3-multi-video-upload.component';

describe('S3MultiVideoUploadComponent', () => {
  let component: S3MultiVideoUploadComponent;
  let fixture: ComponentFixture<S3MultiVideoUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ S3MultiVideoUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(S3MultiVideoUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
