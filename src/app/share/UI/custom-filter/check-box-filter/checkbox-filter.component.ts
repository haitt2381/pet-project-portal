import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {DataSourceFilter} from "../../../model/common/data-source-filter.model";

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.scss'],
})
export class CheckboxFilterComponent implements OnInit{

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  @Input() isCheckbox: boolean;
  @ViewChild("dropdownFilter") dropdownFilter: any;
  params: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params[this.paramName]) {
        this.params = params[this.paramName]
      }
    })

  }

  handleCheckboxChange($event: MdbCheckboxChange) {
    let queryParams;
    let uniqueValue;

    if($event.checked) {
      if(typeof this.params === 'string') {
        this.params = Array.of(this.params)
      }
      uniqueValue = Array.from(new Set(this.params.concat($event.element.value)));
    } else {
      if(typeof this.params === 'string') {
        this.params = Array.of(this.params)
      }

      this.params = this.params.filter(value => {
        return value !== $event.element.value
      });
      uniqueValue = [...new Set(this.params)];
    }

    if(uniqueValue?.length === 0) {
      console.log("reset params")
      this.params = undefined;
    }

    queryParams = {
      [this.paramName]: uniqueValue
    }

    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }
}
