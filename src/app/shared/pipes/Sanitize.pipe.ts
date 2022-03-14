import { Pipe, PipeTransform, SecurityContext } from "@angular/core";
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'byPassSecurity'
})
export class ByPassSecurityPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) {}

    transform (value: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
}