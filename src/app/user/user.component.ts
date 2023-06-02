import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";
import {AlertService} from "../share/services/alert.service";
import {GetUsersResponse} from "../share/model/user/get-users-response.model";
import {ResponseInfo} from "../share/model/common/response-info.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, startWith, switchMap, throwError} from "rxjs";
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
import {getQueryStorage} from "../share/services/Utils.service";

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
  isRecycleMode: boolean = false;
  queryStorage: QueryParamsUser;

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
  ) {
    _headerService.setTitle("USER MANAGEMENT")
  }

  ngOnInit() {
    this.queryStorage = getQueryStorage();
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    merge(
      this.sort.sortChange,
      this.paginator.page,
    ).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;
        this._cd.detectChanges();
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
        this._cd.detectChanges();
      },
    });
  }

  private buildGetUserRequest() {
    this.queryStorage = getQueryStorage();
    let sortInfo = new SortInfo(this.sort.direction, this.sort.active);
    let requestInfo = new RequestInfo(this.paginator.pageIndex, this.paginator.pageSize, sortInfo);
    let getUsersRequest = new GetUsersRequest(requestInfo);
    getUsersRequest.setRole = this.queryStorage.role;
    getUsersRequest.isActive = this.queryStorage.active;
    getUsersRequest.isExcludeCurrentUserLogged = true;
    getUsersRequest.isDeleted = this.isRecycleMode;
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
      switch (action) {
        case PopConfirmConstant.TEXT_SURE: {
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
    this._userService.getUsers(this.buildGetUserRequest()).subscribe({
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
      switch (action) {
        case PopConfirmConstant.TEXT_SURE: {
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
}
