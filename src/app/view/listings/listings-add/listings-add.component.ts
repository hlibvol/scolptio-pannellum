import { Component, EventEmitter, Input, Inject, OnInit, Output, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Listing } from '../listing.model';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ListingService } from '..//listing.service';
import { ToastrService } from 'ngx-toastr';
import { listings_add } from '../../../shared/toast-message-text';
import { Properties } from '../../properties/properties.model';
declare var $: any;
declare const google;

@Component({
  selector: 'app-listings-add',
  templateUrl: './listings-add.component.html',
  styleUrls: ['./listings-add.component.scss']
})
export class ListingsAddComponent implements OnInit {

  @Input() organizationId: string;
  @Output() addSuccessEvent = new EventEmitter<string>();

  public Editor = ClassicEditor;
  @Input() list: Listing;
  errorMsg: string;
  isDisabled = false;

  constructor(private listingService: ListingService,
    private toastr: ToastrService, private renderer2: Renderer2, @Inject(DOCUMENT) private document: Document) {
    this.list = new Listing();
    this.list.savings = 0;
    this.list.utilities = new Array();
    this.list.IsFromListingModule = true;
  }

  ngOnInit(): void {
    this.list.isFeaturedListing = false;
    this.list.id = "";
    this.list.organizationId = "";
    this.list.mapInformation = "";
    this.list.city = "city";
    this.list.state = "state";
    this.list.listingPrice = 0;
    this.list.marketValue = 0;
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
    const map = new google.maps.Map(this.document.getElementById("map") as HTMLInputElement, {
      center: {
        lat: 21.2046704,
        lng: 72.8358745
      },
      zoom: 13
    });

    const input = document.getElementById("txtSearchPlaces") as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "icon",
      "name"
    ]);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = this.document.getElementById("infowindow-content") as HTMLInputElement;
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

  save() {
    this.errorMsg = '';
    const utls = [];
    const utilities = document.getElementById('utilities-add');
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
    this.list.utilities = utls;
    this.list.organizationId = this.organizationId;
    this.list.IsFromListingModule = true;
    this.listingService.Save(this.list).subscribe((data: any[]) => {
      this.reset();
      this.addSuccessEvent.emit("value");
      this.toastr.info(listings_add.add_list_success);
      $('#createListing').modal('toggle');
    }, (error) => {
      this.errorMsg = error;
      if(error && typeof error === 'string')
        this.toastr.error(error);
      else
        this.toastr.error(listings_add.add_list_error);
    })
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.list.description = data;
    let tempList = this.list;
    delete tempList.id;
    delete tempList.organizationId;
    delete tempList.mapInformation;
    delete tempList.isFeaturedListing;

    var values = Object.values(tempList);
    for (let i = 0; i < values.length; i ++) {
      if (values[i] == undefined || values[i] == null || values[i] === "undefined" || values[i] == "") {
        console.log(values[i], i);
        this.isDisabled = true;
        break;
      } else
        this.isDisabled = false;
    }
  }

  onChangeData (val) {
    let tempList = this.list;
    delete tempList.id;
    delete tempList.organizationId;
    delete tempList.mapInformation;
    delete tempList.isFeaturedListing;
    var values = Object.values(tempList);
    var values1 = Object.values(this.list);
    for (let i = 0; i < values.length; i ++) {
      if (values[i] == undefined || values[i] == null || values[i] === "undefined" || values[i] == "") {
        this.isDisabled = true;
        break;
      } else
        this.isDisabled = false;
    }

    let savings = this.list.marketValue - this.list.listingPrice;
    if(!isNaN(savings))
      this.list.savings = savings / 100 + savings % 100;
  }

  reset() {
    this.list = new Listing();
    this.list.savings = 0;
    this.list.utilities = new Array();
    const utilities = document.getElementById('utilities-add');
    if (utilities) {
      const options = utilities['options'];
      if (options && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
          $('#utilities-add')[0]['options'][i].selected = false;
        }
      }
    }
    if ($('.select2').length) {
      $('.select2').select2();
    }
  }
  async apnLookup(): Promise<void>{
    if(!this.list.apn){
      this.toastr.error('Please enter an APN')
      return;
    }
    let result: Properties[] = await this.listingService.apnLookup(this.list.apn).toPromise();
    if(!result || !result.length)
      this.toastr.warning('No records found')
    else if(result.length > 1)
      this.toastr.error('Something went wrong. Multiple properties found with this APN')
    else{
      var listingPrice = this.list?.listingPrice;
      var marketValue = this.list?.marketValue;

      var property = result[0];
      this.list = property;
      this.list.PropertyId = property.id;
      this.list.address = property.propertyAddress;
      this.list.country = property.countyName;
      this.list.listingPrice = listingPrice;
      this.list.marketValue = marketValue;
      if(property.lotAreaUnits === 'AC'){
        var areaInSqft:number = Math.floor(parseFloat(property.lotArea) * 43560);
        if(!isNaN(areaInSqft))
          this.list.parcelSize = areaInSqft + '';
      }
      else
        this.list.parcelSize = property.lotArea
      this.onChangeData(0);
    }
  }

}
