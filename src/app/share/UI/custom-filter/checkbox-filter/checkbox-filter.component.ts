import {Component, Input, OnInit} from '@angular/core';
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";
import {QueryStorageService} from "../../../services/query-storage.service";

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss'],
})
export class CheckboxFilterComponent implements OnInit {

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  queryStorage;

  constructor(
    public sanitizer: DomSanitizer,
    private _queryService: QueryStorageService,
  ) {
  }

  ngOnInit(): void {
    this._queryService.item.subscribe(() => {
      this.queryStorage = this._queryService.getItem;
    })
  }

  onCheckboxChange($event: MdbCheckboxChange) {
    this.queryStorage[this.paramName] = this.queryStorage[this.paramName] ? this.queryStorage[this.paramName] : [];
    let uniqueValue;

    if ($event.checked) {
      uniqueValue = Array.from(new Set(this.queryStorage[this.paramName].concat($event.element.value)));
    } else {
      this.queryStorage[this.paramName] = this.queryStorage[this.paramName].filter(value => {
        return value !== $event.element.value
      });
      uniqueValue = [...new Set(this.queryStorage[this.paramName])];
    }

    this.queryStorage[this.paramName] = uniqueValue.length !== 0 ? uniqueValue : undefined;

    this._queryService.setItem = this.queryStorage;
  }
}
