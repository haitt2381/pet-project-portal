import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";
import {QueryParamsUser} from "../../../model/common/query-params-user";
import {QueryStorageService} from "../../../services/query-storage.service";

@Component({
  selector: 'app-radio-box-filter',
  templateUrl: './radio-box-filter.component.html',
  styleUrls: ['./radio-box-filter.component.scss'],
})
export class RadioBoxFilterComponent implements OnInit {

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  queryStorage: QueryParamsUser;

  constructor(
    public sanitizer: DomSanitizer,
    private _queryService: QueryStorageService,
  ) {
  }

  ngOnInit() {
    this._queryService.item.subscribe(() => {
      this.queryStorage = this._queryService.getItem;
    })
  }

  onClickRadioBox($event, value: string) {
    let isHasItem = !!this.queryStorage[this.paramName];
    if (isHasItem && this.queryStorage[this.paramName].includes(value)) {
      this.queryStorage[this.paramName] = undefined
      $event.target.checked = false;
    } else {
      this.queryStorage[this.paramName] = value;
    }

    this._queryService.setItem = this.queryStorage;
  }
}
