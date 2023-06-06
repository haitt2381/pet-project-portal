import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {QueryStorageService} from "../../../services/query-storage.service";

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent implements OnInit {
  @Input() paramName: string;
  isDateSelected: boolean;
  dateRangePickerForm;
  queryStorage: any;

  constructor(
    private _fb: FormBuilder,
    private _queryService: QueryStorageService,
  ) {
  }

  ngOnInit() {
    this._queryService.item.subscribe(() => {
      this.queryStorage = this._queryService.getItem;
      let fromDate = this.queryStorage['fromDate'] ? this.queryStorage['fromDate'] : '';
      let toDate = this.queryStorage['toDate'] ? this.queryStorage['toDate'] : '';
      this.dateRangePickerForm = this._fb.group({start: fromDate, end: toDate});
      this.isDateSelected = fromDate?.length > 0 || toDate?.length > 0;
    })
  }

  onChangeDateFilter() {
    if (this.dateRangePickerForm.valid) {
      this.queryStorage['fromDate'] = this.dateRangePickerForm.value.start;
      this.queryStorage['toDate'] = this.dateRangePickerForm.value.end;
    }
    this._queryService.setItem = this.queryStorage;
  }

  onRemoveDateFilter() {
    this.queryStorage['fromDate'] = undefined;
    this.queryStorage['toDate'] = undefined;
    this._queryService.setItem = this.queryStorage;
  }
}
