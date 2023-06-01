import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSortable, Sort} from "@angular/material/sort";
import {interval, Subject, Subscription, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {QueryParamsConstant as paramName }  from "../constant/query-params.constant";

@Directive({
  selector: '[appNgMatTableQueryReflector]'
})
export class NgMatTableQueryReflectorDirective implements OnInit, OnDestroy {
  private unsubscribeAll$: Subject<any> = new Subject();

  @Input() matSortActive: string;
  @Input() matSortDirection: 'asc' | 'desc';
  @Input() dataSource: MatTableDataSource<any>;
  private _dataSourceChecker$: Subscription;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.waitForDatasourceToLoad();
    this._initialSetup();
    this.listenToStateChangeEvents();
  }

  private _initialSetup(): void {

    const activePageQuery = this.isPageQueryActive();

    if (activePageQuery) {
      this.dataSource.paginator.pageIndex = activePageQuery[paramName.PAGE_INDEX];
      this.dataSource.paginator.pageSize = activePageQuery[paramName.PAGE_SIZE];
    }

    // Activating initial Sort
    const activeSortQuery = this.isSortQueryActive();
    if (activeSortQuery) {
      let sortDirection = activeSortQuery[paramName.SORT_DIRECTION] ? activeSortQuery[paramName.SORT_ACTIVE] : null;
      const sortActiveColumn = activeSortQuery ? sortDirection : this.matSortActive;
      const sortable: MatSortable = {
        id: sortActiveColumn,
        start: activeSortQuery ? (activeSortQuery[paramName.SORT_DIRECTION] || null) : this.matSortDirection,
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

  private isSortQueryActive(): { [paramName.SORT_ACTIVE]: string, [paramName.SORT_DIRECTION]: 'asc' | 'desc' } {

    const queryParams = this._activatedRoute.snapshot.queryParams;

    if (queryParams.hasOwnProperty(paramName.SORT_ACTIVE) || queryParams.hasOwnProperty(paramName.SORT_DIRECTION)) {
      return {
        [paramName.SORT_ACTIVE]: queryParams[paramName.SORT_ACTIVE],
        [paramName.SORT_DIRECTION]: queryParams[paramName.SORT_DIRECTION]
      };
    }
  }

  private isPageQueryActive(): { [paramName.PAGE_SIZE]: number, [paramName.PAGE_INDEX]: number } {

    const queryParams = this._activatedRoute.snapshot.queryParams;

    if (queryParams.hasOwnProperty(paramName.PAGE_SIZE) || queryParams.hasOwnProperty(paramName.PAGE_INDEX)) {
      return {
        [paramName.PAGE_SIZE]: queryParams[paramName.PAGE_SIZE],
        [paramName.PAGE_INDEX]: queryParams[paramName.PAGE_INDEX]
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

    const sortingAndPaginationQueryParams = {
      [paramName.SORT_ACTIVE]: sortChange.active,
      [paramName.SORT_DIRECTION]: sortChange.direction,
    };

    this._router.navigate([], {queryParams: sortingAndPaginationQueryParams, queryParamsHandling: 'merge'}).then();
  }

  private _applyPageStateChangesToUrlQueryParams(pageChange: PageEvent): void {

    const sortingAndPaginationQueryParams = {
      [paramName.PAGE_SIZE]: pageChange.pageSize,
      [paramName.PAGE_INDEX]: pageChange.pageIndex,
    };

    this._router.navigate([], {queryParams: sortingAndPaginationQueryParams, queryParamsHandling: 'merge'}).then();
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
