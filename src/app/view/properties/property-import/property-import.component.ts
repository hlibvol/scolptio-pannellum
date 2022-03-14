import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscriber } from 'rxjs';
import { property_import, success_icon } from 'src/app/shared/toast-message-text';
import { PropertiesService } from '../properties.service';

declare var $: any;
@Component({
  selector: 'app-property-import',
  templateUrl: './property-import.component.html',
  styleUrls: ['./property-import.component.scss',
    '../../../../assets/css/app.css',]
})
export class PropertyImportComponent implements OnInit {

  @Output() addSuccessEvent = new EventEmitter<string>();

  @ViewChild('myFileInput')
  myFileInputVariable: ElementRef;

  public Editor = ClassicEditor;
  isLoading = false;
  isSaving = false;
  fileData: any;
  selectdFileName: string;
  selectedTab = 1;
  fileTypeError = false;
  fileInputError = false;
  fileType: string;
  fileId: string;
  matchData: any;
  listProvider: string;
  propertyType: string;

  listProviderError = false;
  propertyTypeError = false;
  totalColumnCount = 0;
  mappedColumnCount = 0;
  isSubmitMapReady = false;
  dbColumnsStatus: any;
  isInitiateImportComplete = false;
  initiateImportCompleteMsg: string;
  requiredColumnMapComplete = true;
  dbColumns: [{ columnName: string, displayName: string, isDefault: boolean, isMapped: boolean, isChecked: boolean }];
  checkAll:boolean = false;

  constructor(private propertiesService: PropertiesService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  tabSelected(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  Submt() {
debugger;
    this.fileInputError = false;
    this.fileTypeError = false;

    if (this.selectedTab === 1) {
      this.UploadFile();
    } else if (this.selectedTab === 2) {
      this.MapProperty();
    }
  }

  UploadFile() {
    if (this.fileType !== 'csv' && this.fileType !== 'xls') {
      this.fileTypeError = true;
      return;
    }

    if (!this.fileData) {
      this.fileInputError = true;
      return;
    }
    this.fileData = this.fileData.split(',')[1];
    this.isSaving = true;
    this.propertiesService.ImportFile(this.selectdFileName, this.fileData, this.fileType).subscribe((data: any) => {
      this.isSaving = false;
      this.fileId = data;
      this.selectedTab = 2;
      $('#import-file .nav-tabs li:eq(1) a').tab('show');
    }, (error) => {
      this.isSaving = false;
    })
  }

  GetMapImportHeader() {

    this.listProviderError = false;
    this.propertyTypeError = false;

    if (!this.listProvider) {
      this.listProviderError = true;
      return;
    }

    if (!this.propertyType) {
      this.propertyTypeError = true;
      return;
    }

    this.isSaving = true;
    this.propertiesService.GetMapImportHeader(this.fileId, this.listProvider, this.propertyType).subscribe((data: any) => {
      this.isSaving = false;
      this.matchData = data;
      this.dbColumnsStatus = JSON.parse(JSON.stringify(data['dbColumnsStatus']));
      this.totalColumnCount = this.matchData['dbColumnsStatus'].length;
      this.mappedColumnCount = this.matchData['dbColumnsStatus'].filter((x: any) => x.isMapped === true).length;

      this.dbColumns = this.matchData['dbColumnsStatus'];
      if (this.dbColumns && this.dbColumns.length > 0) {
        for (const column of this.dbColumns) {
          if (column.isDefault) {
            column.isChecked = true;
          } else {
            column.isChecked = false;
          }
          column.columnName = column.displayName;
        }
      }

      this.isSubmitMapReady = true;
      if (this.totalColumnCount && this.totalColumnCount > 0) {
        this.requiredColumnMapComplete = false;
        $('#requiredColumn').modal('toggle');
      }
    }, (error) => {
      this.isSaving = false;
    })
  }

  MapRequiredColumn() {
    this.isSaving = true;
    setTimeout(() => {
      let isAllMapped = true;
      for (const column of this.dbColumns) {
        if (column.isDefault) {
          if (!column.isChecked) {
            isAllMapped = false;
            this.toastr.error(property_import.default_column_validation);
            break;
          }
        }
      }
      if (isAllMapped) {
        this.totalColumnCount = this.dbColumns.filter((x: any) => x.isChecked).length;
        this.mappedColumnCount = this.dbColumns.filter((x: any) => x.isChecked && x.isMapped).length;
        this.requiredColumnMapComplete = true;
        this.CloseRequiredMap();
      } else {
        this.requiredColumnMapComplete = false;
      }
      this.isSaving = false;
    }, 500);
  }

  MapProperty() {
debugger;
    let mappedColumn = {};
    let notAllColumnMapped = false;
    for (const column of this.dbColumns) {
      if (column.isChecked) {
        const fileColumn = this.matchData['collumnsInCsv'].find((columnName: any) => columnName === column.columnName);
        if (!fileColumn) {
          notAllColumnMapped = true;
          break;
        } else {
          column.columnName = fileColumn;
        }
      }
      const oldColumn = this.dbColumnsStatus.find((x: any) => x.displayName === column.displayName);
      if (oldColumn) {
        mappedColumn[oldColumn.columnName] = column.columnName;
      }
    }

      this.isSaving = true;
      this.propertiesService.MapProperty(this.fileId, mappedColumn).subscribe((data: any) => {
        this.isSaving = false;
        // this.fileId = data;
        if (data === true) {
          this.selectedTab = 3;
          $('#import-file .nav-tabs li:eq(2) a').tab('show');
        } else {
          this.toastr.error(property_import.map_column_error);
        }
      }, (error) => {
        this.isSaving = false;
      });
  }

  InitiateImport() {
    this.isSaving = true;
    this.propertiesService.InitiateImport(this.fileId).subscribe((data: any) => {
      this.initiateImportCompleteMsg = data;
      this.isInitiateImportComplete = true;
      $('#import-file .nav-tabs li:eq(3) a').tab('show');
      this.isSaving = false;
    }, (error) => {
      this.isSaving = false;
    })
  }

  MigrateData() {
    this.isSaving = true;
    this.propertiesService.MigrateData(this.fileId).subscribe((data: any) => {
      this.isSaving = false;
      this.toastr.info(success_icon + data);
      this.addSuccessEvent.emit("value");
      this.close();
    }, (error) => {
      this.isSaving = false;
      this.toastr.error(property_import.migrate_data_error);
    })
  }

  getMappedColumns() {
    return this.dbColumns.filter((col: any) => col.isMapped === true && col.isChecked === true);
  }

  getUnMappedColumns() {
    return this.dbColumns.filter((col: any) => col.isMapped === false && col.isChecked === true);
  }

  toggleCollapse(elId: string) {
    $('#' + elId).toggleClass("os-icon-plus-circle").toggleClass("os-icon-minus-circle");
  }

  gotoPreviousTab() {
    this.selectedTab = this.selectedTab - 1;
    $(`#import-file .nav-tabs li:eq(${this.selectedTab - 1}) a`).tab('show');
  }


  onChangeFile($event: Event) {
    this.isLoading = true;
    const file = ($event.target as HTMLInputElement).files[0];
    this.selectdFileName = file.name;
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((data) => {
      this.fileData = data;
      this.isLoading = false;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      subscriber.next(fileReader.result);
      subscriber.complete();
    }

    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    }
  }
  close() {

    this.myFileInputVariable.nativeElement.value = "";

    this.isLoading = false;
    this.isSaving = false;
    this.fileData = undefined;
    this.selectdFileName = undefined;
    this.selectedTab = 1;
    this.fileTypeError = false;
    this.fileInputError = false;
    this.fileType = undefined;
    this.fileId = undefined;
    this.matchData = undefined;
    this.listProvider = undefined;
    this.propertyType = undefined;

    this.listProviderError = false;
    this.propertyTypeError = false;
    this.totalColumnCount = 0;
    this.mappedColumnCount = 0;
    this.isSubmitMapReady = false;
    this.dbColumnsStatus = undefined;
    this.isInitiateImportComplete = false;
    this.initiateImportCompleteMsg = undefined;
    $('#import-file .nav-tabs li:eq(0) a').tab('show');
    $('#import-file').modal('toggle');
  }

  CloseRequiredMap() {
    $('#requiredColumn').modal('toggle');
  }
  
  toggleCheckAll():void{
    this.dbColumns.filter(x => !x.isDefault).map(y => y.isChecked = this.checkAll);
  }
  verifyCheckAll():void{
    if(this.dbColumns.filter(x => !x.isDefault && !x.isChecked).length)
      this.checkAll = false;
    else
      this.checkAll = true;
  }
}
