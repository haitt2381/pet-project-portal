import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {getQueryStorage, setQueryStorage} from "../../../services/Utils.service";

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent implements OnInit {
  @Input() paramName: string;
  @Output() changeDateFilter = new EventEmitter();
  isDateSelected: boolean;
  dateRangePickerForm
  queryStorage: any;

  constructor(
    private _fb: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.queryStorage = getQueryStorage();
    let fromDate = this.queryStorage['fromDate'] ? this.queryStorage['fromDate'] : '';
    let toDate = this.queryStorage['toDate'] ? this.queryStorage['toDate'] : '';
    this.dateRangePickerForm = this._fb.group({start: fromDate, end: toDate});
    if (fromDate?.length > 0 || toDate?.length > 0) {
      this.isDateSelected = true;
    }
  }

  onChangeDateFilter() {
    this.queryStorage = getQueryStorage();
    if (this.dateRangePickerForm.valid) {
      this.queryStorage['fromDate'] = this.dateRangePickerForm.value.start;
      this.queryStorage['toDate'] = this.dateRangePickerForm.value.end;
    }
    this.isDateSelected = true;
    setQueryStorage(this.queryStorage);
    this.changeDateFilter.emit();
  }

  onRemoveDateFilter() {
    this.queryStorage = getQueryStorage();
    this.dateRangePickerForm.reset();
    this.isDateSelected = false;
    this.queryStorage['fromDate'] = null;
    this.queryStorage['toDate'] = null;
    setQueryStorage(this.queryStorage);
    this.changeDateFilter.emit();
  }
}
