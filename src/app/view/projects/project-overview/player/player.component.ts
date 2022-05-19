import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { S3BucketService } from 'src/app/shared/s3-bucket.service';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnDestroy, OnChanges {

  @ViewChild('iframe')
  private iFrameRef: ElementRef;

  @Input() darkMode: boolean;
  @Input() path: string;
  @Input() type: string;

  sanitizer;
  //
  constructor(el: ElementRef, s3BucketService: S3BucketService, sanitizer: DomSanitizer) {
      this.sanitizer = sanitizer;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.path.firstChange) {
      const iFrameElement = this.iframe;
      console.log('iframe', iFrameElement);
      iFrameElement.src = this.path;
      console.log(this.type);
    }
  }

  private get iframe(): HTMLIFrameElement {
    return this.iFrameRef.nativeElement;
  }

  ngOnDestroy() {
    const iFrameElement = this.iframe;
    iFrameElement.src = "";
  }
}