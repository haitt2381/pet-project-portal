import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";
import {getQueryStorage, setQueryStorage} from "../../../services/Utils.service";
import {QueryParamsUser} from "../../../model/common/query-params-user";

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss'],
})
export class CheckboxFilterComponent implements OnInit{

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  @Output() toggleCheckbox = new EventEmitter();

  queryStorage: QueryParamsUser;


  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.queryStorage = getQueryStorage();
  }

  onCheckboxChange($event: MdbCheckboxChange) {
    this.queryStorage = getQueryStorage()
    this.queryStorage[this.paramName] = this.queryStorage[this.paramName] ? this.queryStorage[this.paramName] : [];
    let uniqueValue;

    if($event.checked) {
      uniqueValue = Array.from(new Set(this.queryStorage[this.paramName].concat($event.element.value)));
    } else {
      this.queryStorage[this.paramName] = this.queryStorage[this.paramName].filter(value => {
        return value !== $event.element.value
      });
      uniqueValue = [...new Set(this.queryStorage[this.paramName])];
    }

    this.queryStorage[this.paramName] = uniqueValue;
    setQueryStorage(this.queryStorage);

    this.toggleCheckbox.emit();
  }
}
