import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {QueryParams} from "../../../model/common/query-params.model";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  isDateSelected: boolean;
  params: string;
  @Input() paramName: string;
  dateRangePickerForm = this._fb.group({start: [''], end: ['']});

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: QueryParams) => {
      if (params[this.paramName]) {
        this.params = params[this.paramName]
      }
    })
  }

  onChangeDateFilter() {
    let queryParams = null;
    if (this.dateRangePickerForm.valid) {
      queryParams = {
        ["fd"]: JSON.stringify(this.dateRangePickerForm.value.start),
        ["td"]: JSON.stringify(this.dateRangePickerForm.value.end),
      }
    }
    console.log()
    this.isDateSelected = true;
    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }

  onRemoveDateFilter() {
    this.dateRangePickerForm = this._fb.group({start: [''], end: ['']});
    this.isDateSelected = false;
    let queryParams = {
      ["fd"]: null,
      ["td"]: null,
    }
    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }
}
