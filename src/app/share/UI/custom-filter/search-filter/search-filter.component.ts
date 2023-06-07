import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";
import {debounceTime, filter, fromEvent} from "rxjs";
import {QueryStorageService} from "../../../services/query-storage.service";

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
})
export class SearchFilterComponent implements OnInit, AfterViewInit {
  @Input() paramName: string;
  @Output() keywordChange = new EventEmitter();
  @ViewChild('inputSearch') inputSearchRef: ElementRef;
  inputControl;
  queryStorage;

  constructor(private _query: QueryStorageService,) {
  }

  ngOnInit() {
    this._query.item.subscribe(() => {
      this.queryStorage = this._query.getItem;
      this.queryStorage[this.paramName] = this.queryStorage[this.paramName] ? this.queryStorage[this.paramName] : '';
      this.inputControl = new FormControl(this.queryStorage[this.paramName]);
    })
  }

  ngAfterViewInit() {
    fromEvent(this.inputSearchRef.nativeElement, 'keydown')
      .pipe(filter((e: KeyboardEvent) => e.key === 'Enter'))
      .subscribe(() => {
        this.onKeywordChange();
      });

    fromEvent(this.inputSearchRef.nativeElement, 'input')
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this.onKeywordChange();
      });
  }

  onKeywordChange() {
    if (!this.inputControl.value || this.inputControl.value.isEmpty) {
      this.queryStorage[this.paramName] = undefined;
      this._query.setItem = this.queryStorage;
    }

    let isSameTextSearchBefore = this.inputControl.value === this.queryStorage[this.paramName];
    if (!isSameTextSearchBefore && (this.inputControl.value && !this.inputControl.value.isEmpty)) {
      this.queryStorage[this.paramName] = this.inputControl.value;
      this._query.setItem = this.queryStorage;
    }
  }

  onRemoveSearch() {
    this.inputControl.reset();
    this.queryStorage[this.paramName] = undefined;
    this._query.setItem = this.queryStorage;
  }
}
