import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss'],
})
export class CustomFilterComponent implements OnInit {

  @Input() dataSource: DataSourceFilter[];
  @Input() paramName: string;
  @ViewChild("dropdownFilter") dropdownFilter: any;
  data: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params[this.paramName])
    })
  }

  handleCheckboxChange(event: MdbCheckboxChange) {
    let queryParams = {
      [this.paramName]: null,
    };
    if(event.checked) {
      let uniqueValue = [...new Set(this.data.concat(event.element.value))];

      console.log(uniqueValue)
      queryParams = {
        [this.paramName]: uniqueValue
      }
    }

    this.router.navigate([], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }

}

export interface DataSourceFilter {
  textCheckbox: string;
  valueCheckbox: string;
}
