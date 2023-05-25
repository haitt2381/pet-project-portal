import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";
import {AlertService} from "../share/services/alert.service";
import {GetUsersResponse} from "../share/model/user/GetUsersResponse.model";
import {ResponseInfo} from "../share/model/common/ResponseInfo.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, startWith, switchMap, throwError} from "rxjs";
import {GetUsersRequest} from "../share/model/user/GetUsersRequest.model";
import {RequestInfo, SortInfo} from "../share/model/common/RequestInfo.model";
import {MatTableDataSource} from "@angular/material/table";
import {CheckboxFilterComponent} from "../share/UI/custom-filter/checkbox-filter.component";
import {HeaderTitleService} from "../header/header-title.service";
import {QueryParams} from "../share/model/common/query-params.model";
import {dataSourceActiveFilter, dataSourceRoleFilter} from "../share/constant/data-source-filter.constant";
import {Role} from "../share/constant/role.constant";
import {RadioBoxFilterComponent} from "../share/UI/custom-filter/radio-box-filter.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  protected readonly ADMIN = Role.ADMIN;
  protected readonly MODERATOR = Role.MODERATOR;
  protected readonly MEMBER = Role.MEMBER;
  protected readonly dataSourceRoleFilter = dataSourceRoleFilter;
  protected readonly dataSourceActiveFilter = dataSourceActiveFilter;

  users: User[];
  responseInfo: ResponseInfo;
  isLoading: boolean = false;
  dataSource: MatTableDataSource<User>;
  queryParams: QueryParams;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild("roleFilter", {static: true}) roleFilter: CheckboxFilterComponent;
  @ViewChild("activeFilter", {static: true}) activeFilter: RadioBoxFilterComponent;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _alertService: AlertService,
    private _headerService: HeaderTitleService,
  ) {
    _headerService.setTitle("USER MANAGEMENT")
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._route.queryParams.subscribe((params: QueryParams) => {
      this.queryParams = params;
    })
  }

  ngAfterViewInit(): void {
    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.roleFilter.dropdownFilter.dropdownHidden,
      this.activeFilter.dropdownFilter.dropdownHidden,
    ).pipe(
      startWith({}),
      switchMap(() => {
        let getUsersRequest = this.buildGetUserRequest();
        return this._userService.getUsers(getUsersRequest)
          .pipe(catchError((err) => throwError(() => {
              this._alertService.handleErrors(err)
            }
          )));
      }),
      map(data => {
        return data;
      }),
    ).subscribe({
      next: (resData: GetUsersResponse) => {
        this.users = resData.data;
        this.responseInfo = resData.responseInfo;
        this.isLoading = false;
      },
    });
  }

  private buildGetUserRequest() {
    this.isLoading = true;
    let sortInfo = new SortInfo(this.sort.direction, this.sort.active);
    let requestInfo = new RequestInfo(this.paginator.pageIndex, this.paginator.pageSize, sortInfo);
    let getUsersRequest = new GetUsersRequest(requestInfo);
    getUsersRequest.setRole = this.queryParams.role;
    getUsersRequest.isActive = this.queryParams.active;
    return getUsersRequest;
  }

  onEditUser(user: User) {
    this._router.navigate(['user', 'new']).then();
  }
}
