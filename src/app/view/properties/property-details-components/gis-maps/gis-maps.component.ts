import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostListener
} from "@angular/core";
import { AppSessionStorageService } from '../../../../shared/session-storage.service';
import { Properties } from '../../properties.model';
import 'leaflet-draw';
import * as L from 'leaflet';
import { GoogleProvider, OpenStreetMapProvider } from 'leaflet-geosearch';
import { PropertiesService } from "../../properties.service";
import { icon } from "leaflet";
import { HttpClient } from "@angular/common/http";
// Import the plugin libraries so they will modify L
// import 'leaflet-path-transform';
// import 'leaflet-path-drag';

@Component({
  selector: 'app-gis-maps',
  templateUrl: './gis-maps.component.html',
  styleUrls: ['./gis-maps.component.scss']
})
export class GisMapsComponent implements OnInit, OnDestroy {
  constructor(private appSessionStorageService: AppSessionStorageService, public propertiesService: PropertiesService) {
    this.propertiesService.propertyOnParent.subscribe((property) => {
      this.property = property;
      this.initMap();
    })
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.classList.contains("removeMarker"))
      this.clearMarker((event.target).getAttribute('data-id'), this.map);
  }

  property: Properties;
  map: any = null;
  lat: any;
  long: any;
  markers: any = [];
  public custom: L.Control;
  @Input() position: L.ControlPosition;
  ngOnInit() {
    L.Icon.Default.imagePath = "assets/img/map/"
    if (!this.property) {
      this.property = history.state.data;
      if (this.property) {
        this.initMap();
      }
    }







  }
  initMap() {
    if (this.property.latitude && this.property.longitude) {
      this.lat = this.property.latitude;
      this.long = this.property.longitude;
      this.map = L.map('map').setView([parseFloat(this.property.latitude), parseFloat(this.property.longitude)], 12);
      this.createMap();
    }
    else {
      const provider = new GoogleProvider({
        params: {
          key: 'AIzaSyAkgh7ckSQasqRYvX7BXOwEGEzunexf_EY'
        },
      });
      const results = provider.search({ query: (this.property.propertyAddress + ', ' + this.property.pCity + ', ' + this.property.pState + ', ' + this.property.pZip) }).then((res: any) => {
        this.lat = res[0].y;
        this.long = res[0].x;
        this.map = L.map('map').setView([parseFloat(res[0].y), parseFloat(res[0].x)], 10, { animate: true, duration: 5 });
        this.createMap();
      });
    }
  }

  createMap() {
    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxNativeZoom: 19,
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);

    const iconRetinaUrl = './assets/img/map/marker-icon-2x.png';
    const iconUrl = './assets/img/map/marker-icon.png';
    const shadowUrl = './assets/img/map/marker-shadow.png';

    // L.Icon.Default.mergeOptions({
    //   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    //   iconUrl: require('leaflet/dist/images/marker-icon.png'),
    //   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    // });

    L.marker([parseFloat(this.lat), parseFloat(this.long)]).addTo(this.map);

    this.map.flyTo([this.lat, this.long], 19);

    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
      draw:{
        },
      edit: {
        featureGroup: drawnItems
      }
    });
   
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, e => {
      // const type = (e as L.DrawEvents.Created).layerType;
      // if (type === 'marker') {
      //   var id;
      //   if (this.markers.length < 1) id = 0
      //   else id = this.markers[this.markers.length - 1]._id + 1
      //   var popupContent =
      //     '<button data-id="' + id + '" class="removeMarker" >Clear Marker</button>';

      //   let myMarker: any = L.marker(e.layer._latlng, {
      //     draggable: false
      //   });
      //   myMarker._id = id
      //   var myPopup = myMarker.bindPopup(popupContent, {
      //     closeButton: false
      //   });
      //   this.map.addLayer(myMarker)
      //   this.markers.push(myMarker)
      // }
      // else {
      //   const type = (e as L.DrawEvents.Created).layerType,
      //     layer = (e as L.DrawEvents.Created).layer;

      //   // this.markers.push(layer);
      //   drawnItems.addLayer(layer);
      // }
      const type = (e as L.DrawEvents.Created).layerType,
        layer = (e as L.DrawEvents.Created).layer;

      // if (type === 'marker') {
      //   layer.bindPopup(popupContent);
      // }

      // this.markers.push(layer);
      drawnItems.addLayer(layer);
    });
  }

  clearMarker(id, map) {
    var new_markers = []
    this.markers.forEach(function (marker) {
      if (marker._id == id) map.removeLayer(marker)
      else new_markers.push(marker)
    })
    this.markers = new_markers
  }

  ngOnDestroy() {

  }

}
