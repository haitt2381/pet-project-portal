import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss'],
})
export class CustomFilterComponent{

  @Input() dataSource: DataSourceFilter[];
  @Output() triggerReRender = new EventEmitter<void>();
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {
  }

  handleCheckboxChange(event: MdbCheckboxChange) {
    console.log(event)
    let queryParams = {
      role: null,
    };
    if(event.checked) {
      queryParams = {
        role: event.element.value
      }
    }

    this._router.navigate(['/user'], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
    this.triggerReRender.emit();
  }

}

export interface DataSourceFilter {
  textCheckbox: string;
  valueCheckbox: string;
}
