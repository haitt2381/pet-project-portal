import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";
import {QueryParams} from "../../../model/common/query-params.model";

@Component({
  selector: 'app-radio-box-filter',
  templateUrl: './radio-box-filter.component.html',
  styleUrls: ['./radio-box-filter.component.scss'],
})
export class RadioBoxFilterComponent implements OnInit{

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  @ViewChild("dropdownFilter") dropdownFilter: any;
  params: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: QueryParams) => {
      if (params[this.paramName]) {
        this.params = params[this.paramName]
      }
    })
  }

  handleRadioBoxChange($event, value: string) {
    let queryParams;

    if((this.params !== undefined) && this.params.includes(value)) {
      queryParams = {
        [this.paramName]: undefined,
      }
      $event.target.checked = false;
      this.params = undefined;
    } else {
      queryParams = {
        [this.paramName]: value,
      }
    }
    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }
}
