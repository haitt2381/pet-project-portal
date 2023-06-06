import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSortable, Sort} from "@angular/material/sort";
import {interval, Subject, Subscription, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {QueryStorageService} from "../services/query-storage.service";

@Directive({
  selector: '[appNgMatTableQueryReflector]'
})
export class NgMatTableQueryReflectorDirective implements OnInit, OnDestroy {
  private unsubscribeAll$: Subject<any> = new Subject();

  @Input() matSortActive: string;
  @Input() matSortDirection: 'asc' | 'desc';
  @Input() dataSource: MatTableDataSource<any>;
  private _dataSourceChecker$: Subscription;
  private _queryStorage;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _queryService: QueryStorageService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.waitForDatasourceToLoad();
    this._initialSetup();
    this.listenToStateChangeEvents();
  }

  private _initialSetup(): void {
    this._queryStorage = this._queryService.getItem;

    const activePageQuery = this.isPageQueryActive();

    if (activePageQuery) {
      this.dataSource.paginator.pageIndex = activePageQuery.pageIndex;
      this.dataSource.paginator.pageSize = activePageQuery.pageSize;
    }

    // Activating initial Sort
    const activeSortQuery = this.isSortQueryActive();
    if (activeSortQuery) {
      let sortDirection = activeSortQuery.sortDirection ? activeSortQuery.sortActive : null;
      const sortActiveColumn = activeSortQuery ? sortDirection : this.matSortActive;
      const sortable: MatSortable = {
        id: sortActiveColumn,
        start: activeSortQuery ? (activeSortQuery.sortDirection || null) : this.matSortDirection,
        disableClear: true
      };
      this.dataSource.sort.sort(sortable);

      if (!sortActiveColumn) {
        return;
      }
      const activeSortHeader = this.dataSource.sort.sortables.get(sortActiveColumn);
      if (!activeSortHeader) {
        return;
      }
      activeSortHeader['_setAnimationTransitionState']({
        fromState: this.dataSource.sort.direction,
        toState: 'active',
      });
    }
  }

  private isSortQueryActive(): { sortActive: string, sortDirection: 'asc' | 'desc' } {

    if (this._queryStorage.hasOwnProperty('sortActive') || this._queryStorage.hasOwnProperty('sortDirection')) {
      return {
        sortActive: this._queryStorage.sortActive,
        sortDirection: this._queryStorage.sortDirection
      };
    } else {
      return {
        sortActive: 'modifiedAt',
        sortDirection: 'desc'
      };
    }
  }

  private isPageQueryActive(): { pageSize: number, pageIndex: number } {

    if (this._queryStorage.hasOwnProperty('pageSize') || this._queryStorage.hasOwnProperty('pageIndex')) {
      return {
        pageSize: this._queryStorage.pageSize,
        pageIndex: this._queryStorage.pageIndex
      };
    }
  }

  private listenToStateChangeEvents(): void {
    this.dataSource.sort.sortChange.pipe(
      takeUntil(this.unsubscribeAll$)
    ).subscribe((sortChange: Sort) => {
      this._applySortChangesToUrlQueryParams(sortChange);
    });

    this.dataSource.paginator.page.pipe(
      takeUntil(this.unsubscribeAll$)
    ).subscribe((pageChange: PageEvent) => {
      this._applyPageStateChangesToUrlQueryParams(pageChange);
    });
  }

  private _applySortChangesToUrlQueryParams(sortChange: Sort): void {
    this._queryStorage = this._queryService.getItem;
    this._queryStorage.sortActive = sortChange.active;
    this._queryStorage.sortDirection = sortChange.direction;
    this._queryService.setItem = this._queryStorage;
  }

  private _applyPageStateChangesToUrlQueryParams(pageChange: PageEvent): void {
    this._queryStorage = this._queryService.getItem;
    this._queryStorage.pageSize = pageChange.pageSize;
    this._queryStorage.pageIndex = pageChange.pageIndex;
    this._queryService.setItem = this._queryStorage;
  }

  private waitForDatasourceToLoad(): Promise<void> {

    const titleCheckingInterval$ = interval(500);

    return new Promise((resolve) => {
      this._dataSourceChecker$ = titleCheckingInterval$.subscribe(() => {
        if (this.dataSource?.sort && this.dataSource?.paginator) {
          this._dataSourceChecker$.unsubscribe();
          return resolve();
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.complete();
  }

}
