import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {FormControl} from "@angular/forms";
import {debounceTime, filter, fromEvent, tap} from "rxjs";
import {getQueryStorage, setQueryStorage} from "../../../services/Utils.service";

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
  isSearchFilterActive = false;

  ngOnInit() {
    this.queryStorage = getQueryStorage();
    this.queryStorage[this.paramName] = this.queryStorage[this.paramName] ? this.queryStorage[this.paramName] : '';
    this.inputControl = new FormControl(this.queryStorage[this.paramName]);
  }

  ngAfterViewInit() {
    fromEvent(this.inputSearchRef.nativeElement, 'keydown')
      .pipe(filter((e: KeyboardEvent) => e.key === 'Enter'))
      .subscribe(() => {
        this.onKeywordChange();
      });

    fromEvent(this.inputSearchRef.nativeElement, 'input')
      .pipe(debounceTime(1700))
      .subscribe(() => {
        this.onKeywordChange();
      });
  }

  onKeywordChange() {
    if(!this.inputControl.value || this.inputControl.value.isEmpty) {
      this.isSearchFilterActive = false;
    }
    if(this.inputControl.value === this.queryStorage[this.paramName]) return;

    if(this.inputControl.value && !this.inputControl.value.isEmpty) {
      this.isSearchFilterActive = true;
    }
    this.queryStorage[this.paramName] = this.inputControl.value;
    setQueryStorage(this.queryStorage);
    this.keywordChange.emit();
  }

  onRemoveSearch() {
    this.inputControl.reset();
    this.queryStorage[this.paramName] = '';
    setQueryStorage(this.queryStorage);
    this.isSearchFilterActive = false;
    this.keywordChange.emit();
  }
}
