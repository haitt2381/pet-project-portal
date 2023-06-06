import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";
import {AlertService} from "../share/services/alert.service";
import {GetUsersResponse} from "../share/model/user/get-users-response.model";
import {ResponseInfo} from "../share/model/common/response-info.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, MatSortable} from "@angular/material/sort";
import {GetUsersRequest} from "../share/model/user/get-users-request.model";
import {RequestInfo, SortInfo} from "../share/model/common/request-info.model";
import {MatTableDataSource} from "@angular/material/table";
import {HeaderTitleService} from "../header/header-title.service";
import {dataSourceActiveFilter, dataSourceRoleFilter} from "../share/constant/data-source-filter.constant";
import {Role} from "../share/constant/role.constant";
import {IdResponse} from "../share/model/common/id-response.model";
import {Alert} from "../share/constant/alert.constant";
import {MatDialog} from "@angular/material/dialog";
import {PopConfirmComponent} from "../share/UI/pop-comfirm/pop-confirm/pop-confirm.component";
import {PopConfirmModel} from "../share/model/UI/pop-confirm.model";
import {PopConfirmConstant} from "../share/constant/pop-confirm.constant";
import {QueryParamsUser} from "../share/model/common/query-params-user";
import {QueryStorageService} from "../share/services/query-storage.service";
import {
  APP_DEFAULT_PAGE_INDEX,
  APP_DEFAULT_PAGE_SIZE,
  APP_DEFAULT_SORT_ACTIVE,
  APP_DEFAULT_SORT_DIRECTION
} from "../app.constant";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  protected readonly ADMIN = Role.ADMIN;
  protected readonly MODERATOR = Role.MODERATOR;
  protected readonly MEMBER = Role.MEMBER;
  protected readonly dataSourceRoleFilter = dataSourceRoleFilter;
  protected readonly dataSourceActiveFilter = dataSourceActiveFilter;

  users: User[];
  responseInfo: ResponseInfo;
  isLoading: boolean = false;
  dataSource: MatTableDataSource<User>;
  isRecycleMode: boolean = false;
  isRemoveAllFilterDisable = false
  queryStorage: QueryParamsUser;
  beforePayloadUsers: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _alertService: AlertService,
    private _headerService: HeaderTitleService,
    private _cd: ChangeDetectorRef,
    private _dialog: MatDialog,
    protected _query: QueryStorageService,
  ) {
    _headerService.setTitle("USER MANAGEMENT")
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (Object.keys(this._query.getItem).length === 0) {
      this._query.initData();
    }
    this._query.item.subscribe(() => {
      this.queryStorage = this._query.getItem;
      this.isRemoveAllFilterDisable = Object.keys(this.queryStorage).length === 4
        && ((this.queryStorage.pageSize === APP_DEFAULT_PAGE_SIZE && this.queryStorage.pageIndex === APP_DEFAULT_PAGE_INDEX)
          && (this.queryStorage.sortActive === APP_DEFAULT_SORT_ACTIVE && this.queryStorage.sortDirection === APP_DEFAULT_SORT_DIRECTION))
      this.loadUsers();
    })
  }

  private buildGetUserRequest() {
    let sortInfo = new SortInfo(this.queryStorage.sortDirection, this.queryStorage.sortActive);
    let requestInfo = new RequestInfo(this.queryStorage.pageIndex, this.queryStorage.pageSize, sortInfo);
    let getUsersRequest = new GetUsersRequest(requestInfo);
    getUsersRequest.setRole = this.queryStorage?.role;
    getUsersRequest.isActive = this.queryStorage?.active;
    getUsersRequest.isExcludeCurrentUserLogged = true;
    getUsersRequest.isDeleted = this.isRecycleMode;
    getUsersRequest.fromDate = this.queryStorage?.fromDate;
    getUsersRequest.toDate = this.queryStorage?.toDate;
    getUsersRequest.keyword = this.queryStorage?.keyword;
    return getUsersRequest;
  }

  onEditUser() {
    this._router.navigate(['user', 'new']).then();
  }

  onChangeUserStatus(id: string, status: boolean) {
    this.isLoading = true;
    this._userService.toggleStatusUser(id, status).subscribe({
      next: (resData: IdResponse) => {
        this.users = this.users.map(user => {
          if (user.id === resData.id) {
            user.modifiedAt = new Date();
          }
          return user;
        });
        this.isLoading = false;
        this._alertService.success(Alert.USER_CHANGE_STATUS_SUCCESS);
      },
      error: err => {
        this.isLoading = false;
        this._alertService.handleErrors(err)
      },
    });
  }

  onDeleteUser(id: string) {
    let dialogRef = this._dialog.open(PopConfirmComponent, {
      data: new PopConfirmModel("Are you sure to delete this user"),
    });
    dialogRef.afterClosed().subscribe(action => {
      if (action === PopConfirmConstant.TEXT_OK) {
        {
          this.isLoading = true;
          this._userService.deleteUser(id).subscribe({
            next: (resData: IdResponse) => {
              if (resData.id) {
                this.loadUsers();
              }
              this._alertService.success(Alert.USER_DELETE_SUCCESS);
            },
            error: (err) => {
              this.isLoading = false;
              this._alertService.handleErrors(err)
            }
          });
        }
      }
    });
  }

  loadUsers() {
    let getUsersRequest = this.buildGetUserRequest();
    console.log("call load user")
    if (this.beforePayloadUsers !== JSON.stringify(getUsersRequest)) {
      this.beforePayloadUsers = JSON.stringify(getUsersRequest);
      this.isLoading = true;
      this._userService.getUsers(getUsersRequest).subscribe({
        next: (resData: GetUsersResponse) => {
          this.users = resData.data;
          this.responseInfo = resData.responseInfo;
          this.isLoading = false;
          this._cd.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this._alertService.handleErrors(err);
          this._cd.detectChanges();
        }
      })
    }
  }

  onToggleRecycleMode() {
    this.isRecycleMode = !this.isRecycleMode;
    this.loadUsers();
    let titlePage = this.isRecycleMode ? "USER RECYCLE BIN" : "USER MANAGEMENT";
    this._headerService.setTitle(titlePage);
  }

  onHardDeleteUser(id: string) {
    let dialogRef = this._dialog.open(PopConfirmComponent, {
      data: new PopConfirmModel("Are you sure you want to completely delete this user? If so, you cannot undo this action."),
    });
    dialogRef.afterClosed().subscribe(action => {
      if (action === PopConfirmConstant.TEXT_OK) {
        {
          this.isLoading = true;
          this._userService.hardDeleteUser(id).subscribe({
            next: (resData: IdResponse) => {
              if (resData.id) {
                this.loadUsers();
              }
              this._alertService.success(Alert.USER_DELETE_SUCCESS);
            },
            error: (err) => {
              this.isLoading = false;
              this._alertService.handleErrors(err)
            }
          });
        }
      }
    });
  }

  onRestoreUser(id: string) {
    this.isLoading = true;
    this._userService.restoreUser(id).subscribe({
      next: (resData: IdResponse) => {
        if (resData.id) {
          this.loadUsers();
        }
        this._alertService.success(Alert.USER_RESTORE_SUCCESS);
      },
      error: err => {
        this.isLoading = false;
        this._alertService.handleErrors(err);
      }
    });
  }

  onRemoveAllFilter() {
    if (this.sort.active !== APP_DEFAULT_SORT_ACTIVE || this.sort.direction !== APP_DEFAULT_SORT_DIRECTION) {
      const sortable: MatSortable = {
        id: APP_DEFAULT_SORT_ACTIVE,
        start: APP_DEFAULT_SORT_DIRECTION,
        disableClear: true
      };
      this.sort.sort(sortable);
    }

    if (this.paginator.pageSize !== APP_DEFAULT_PAGE_SIZE || this.paginator.pageIndex !== APP_DEFAULT_PAGE_INDEX) {
      this.paginator._changePageSize(APP_DEFAULT_PAGE_SIZE);
      this.paginator.firstPage();
    }

    this._query.removeItem();
  }
}
