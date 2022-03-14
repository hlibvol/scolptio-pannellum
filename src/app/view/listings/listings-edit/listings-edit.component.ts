import { Component, EventEmitter, Input, OnChanges, OnInit, Inject, Output, Renderer2 } from '@angular/core';
import { Listing } from '../listing.model';
import { DOCUMENT } from '@angular/common';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ListingService } from '../listing.service';
import { ToastrService } from 'ngx-toastr';
import { listings_edit } from '../../../shared/toast-message-text';

declare var $: any
declare const google;

@Component({
  selector: 'app-listings-edit',
  templateUrl: './listings-edit.component.html',
  styleUrls: ['./listings-edit.component.scss']
})
export class ListingsEditComponent implements OnInit, OnChanges {

  @Input() organizationId: string;
  @Input() selectedList: Listing;

  @Output() updateSuccessEvent = new EventEmitter<string>();

  public Editor = ClassicEditor;
  errorMsg: string;
  visi = false;
  descriptionData = '<p>Start typing here...</p>';
  isDisabled = true;

  constructor(private listingService: ListingService,
    private toastr: ToastrService, private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    this.loadAutoComplete();
  }

  private loadAutoComplete() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAkgh7ckSQasqRYvX7BXOwEGEzunexf_EY&libraries=places&v=weekly';
    this.loadScript(url).then(() => this.initAutocomplete());
  }

  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }

  initAutocomplete() {
    const map = new google.maps.Map(this.document.getElementById("mapEdit") as HTMLInputElement, {
      center: {
        lat: 21.2046704,
        lng: 72.8358745
      },
      zoom: 13
    });

    const input = document.getElementById("txtSearchPlacesEdit") as HTMLInputElement;
    console.log(input, "+++");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "icon",
      "name"
    ]);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.document.getElementById("infowindow-contentEdit") as HTMLInputElement;
    infowindow.setContent(infowindowContent);
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        alert('No details available for input:' + input.value);
        return;
      } 

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      let address = "";
      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
          "",
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
          "",
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
          ""
        ].join(" ");
      }
      infowindowContent.children["place-icon"].src = place.icon;
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent = address;
      infowindow.open(map, marker);
    });
  }

  ngOnChanges() {
    
    if (this.selectedList.utilities != null) {
      const utilities = document.getElementById('utilities-edit');
      if (utilities) {
        const options = utilities['options'];
        if (options && options.length > 0) {
          for (let i = 0; i < options.length; i++) {
            const isExist = this.selectedList.utilities.includes(options[i].value);

            if (isExist) {
              $('#utilities-edit')[0]['options'][i].selected = true;
            } else {
              $('#utilities-edit')[0]['options'][i].selected = false;
            }
          }
        }
      }
      if ($('.select2').length) {
        $('.select2').select2();
      }
    }
    if (this.selectedList && this.selectedList.description != null) {
      this.descriptionData = this.selectedList.description;
    }
  }

  save() {
    this.errorMsg = '';
    const utls = [];
    const utilities = document.getElementById('utilities-edit');
    if (utilities != null) {
      const options = utilities['options'];
      if (options && options.length > 0) {
        for (const option of options) {
          if (option.selected) {
            utls.push(option.value);
          }
        }
      }
    }
    this.selectedList.utilities = utls;
    this.selectedList.organizationId = this.organizationId;
    this.selectedList.IsFromListingModule = true;
    this.listingService.Update(this.selectedList).subscribe((data: any[]) => {
      this.updateSuccessEvent.emit("value");
      this.toastr.info(listings_edit.edit_list_success);
      $('#editListing').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      this.toastr.error(listings_edit.edit_list_error);
    })
  }

  onChangeData (val) {
    let tempList = this.selectedList;
    delete tempList.id;
    delete tempList.organizationId;
    delete tempList.mapInformation;
    delete tempList.isFeaturedListing;
    delete tempList.state;
    delete tempList.city;

    var values = Object.values(tempList);
    for (let i = 0; i < values.length; i ++) {
      if (values[i] == undefined || values[i] === "undefined" || values[i] == "") {
        this.isDisabled = true;
        break;
      } else
        this.isDisabled = false;
    }

    let savings = values[1] - values[0];
    this.selectedList.savings = savings / 100 + savings % 100;
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.selectedList.description = data;

    let tempList = this.selectedList; 
    delete tempList.id;
    delete tempList.organizationId;
    delete tempList.mapInformation;
    delete tempList.isFeaturedListing;
    
    var values = Object.values(tempList);
    for (let i = 0; i < values.length; i ++) {
      if (values[i] == undefined || values[i] == null || values[i] === "undefined" || values[i] == "") {
        this.isDisabled = true;
        break;
      } else
        this.isDisabled = false;
    }
  }

}
