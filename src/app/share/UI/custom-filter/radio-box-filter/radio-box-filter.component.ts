import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";
import {QueryParamsUser} from "../../../model/common/query-params-user";
import {getQueryStorage, setQueryStorage} from "../../../services/Utils.service";

@Component({
  selector: 'app-radio-box-filter',
  templateUrl: './radio-box-filter.component.html',
  styleUrls: ['./radio-box-filter.component.scss'],
})
export class RadioBoxFilterComponent implements OnInit {

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  @Output() clickRadioBox = new EventEmitter();
  queryStorage: QueryParamsUser;

  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.queryStorage = getQueryStorage();
  }

  onClickRadioBox($event, value: string) {
    this.queryStorage = getQueryStorage();

    if (this.queryStorage[this.paramName] && this.queryStorage[this.paramName].includes(value)) {
      this.queryStorage[this.paramName] = undefined
      $event.target.checked = false;
    } else {
      this.queryStorage[this.paramName] = value;
    }

    setQueryStorage(this.queryStorage);
    this.clickRadioBox.emit();
  }
}
