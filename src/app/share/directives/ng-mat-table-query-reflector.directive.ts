import {Directive, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSortable, Sort} from "@angular/material/sort";
import {interval, Subject, Subscription, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";

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
      this.dataSource.paginator.pageIndex = activePageQuery.page_index;
      this.dataSource.paginator.pageSize = activePageQuery.page_size;
    }

    // Activating initial Sort
    const activeSortQuery = this.isSortQueryActive();
    if (activeSortQuery) {
      let sortDirection = activeSortQuery.sort_direction ? activeSortQuery.sort_active : null;
      const sortActiveColumn = activeSortQuery ? sortDirection : this.matSortActive;
      const sortable: MatSortable = {
        id: sortActiveColumn,
        start: activeSortQuery ? (activeSortQuery.sort_direction || null) : this.matSortDirection,
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

  private isSortQueryActive(): { sort_active: string, sort_direction: 'asc' | 'desc' } {

    const queryParams = this._activatedRoute.snapshot.queryParams;

    if (queryParams.hasOwnProperty('sort_active') || queryParams.hasOwnProperty('sort_direction')) {
      return {
        sort_active: queryParams.sort_active,
        sort_direction: queryParams.sort_direction
      };
    }
  }

  private isPageQueryActive(): { page_size: number, page_index: number } {

    const queryParams = this._activatedRoute.snapshot.queryParams;

    if (queryParams.hasOwnProperty('page_size') || queryParams.hasOwnProperty('page_index')) {
      return {
        page_size: queryParams.page_size,
        page_index: queryParams.page_index
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
      sort_active: sortChange.active,
      sort_direction: sortChange.direction,
    };

    this._router.navigate([], {queryParams: sortingAndPaginationQueryParams, queryParamsHandling: 'merge'}).then();
  }

  private _applyPageStateChangesToUrlQueryParams(pageChange: PageEvent): void {

    const sortingAndPaginationQueryParams = {
      page_size: pageChange.pageSize,
      page_index: pageChange.pageIndex,
    };

    this._router.navigate([], {queryParams: sortingAndPaginationQueryParams, queryParamsHandling: 'merge'}).then();
  }

  private waitForDatasourceToLoad(): Promise<void> {

    const titleCheckingInterval$ = interval(500);

    return new Promise((resolve) => {
      this._dataSourceChecker$ = titleCheckingInterval$.subscribe(val => {
        if (this.dataSource?.sort && this.dataSource?.paginator) {
          this._dataSourceChecker$.unsubscribe();
          return resolve();
        }
      });
    });

  }

  ngOnDestroy(): void {
    // this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

}
