import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";
import {AlertService} from "../share/services/alert.service";
import {GetUsersResponse} from "../share/model/user/GetUsersResponse.model";
import {ResponseInfo} from "../share/model/common/ResponseInfo.model";
import {ADMIN, MEMBER, MODERATOR} from "../share/constant/role.constant";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {catchError, map, merge, of, startWith, Subscription, switchMap} from "rxjs";
import {GetUsersRequest} from "../share/model/user/GetUsersRequest.model";
import {RequestInfo, SortInfo} from "../share/model/common/RequestInfo.model";
import {MatTableDataSource} from "@angular/material/table";
import {DataSourceFilter} from "../share/UI/custom-filter/custom-filter.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly ADMIN = ADMIN;
  protected readonly MODERATOR = MODERATOR;
  protected readonly MEMBER = MEMBER;

  users: User[];
  responseInfo: ResponseInfo;
  isLoading: boolean = false;
  @ViewChild("test") test: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<User>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.loadDataWithQueryParam();
  }

  onEditUser(user: User) {
    this.router.navigate(['user', 'new']).then();
  }

  dataSourceRoleFilter: DataSourceFilter[] = [
    {
      textCheckbox: `<span class="badge badge-warning rounded-pill d-inline">${ADMIN}</span>`,
      valueCheckbox: ADMIN.toUpperCase()
    },
    {
      textCheckbox: `<span class="badge badge-success rounded-pill d-inline">${MODERATOR}</span>`,
      valueCheckbox: MODERATOR.toUpperCase()
    },
    {
      textCheckbox: `<span class="badge badge-primary rounded-pill d-inline">${MEMBER}</span>`,
      valueCheckbox: MEMBER.toUpperCase()
    }
  ]
  private sub: Subscription;

  loadDataWithQueryParam() {
    this.sub = merge(this.sort.sortChange, this.paginator.page).pipe(
      startWith({}),
      switchMap(() => {
        this.isLoading = true;
        let sortInfo = new SortInfo(this.sort.direction, this.sort.active);
        let requestInfo = new RequestInfo(this.paginator.pageIndex, this.paginator.pageSize, sortInfo);
        let getUsersRequest = new GetUsersRequest("", requestInfo);
        return this.userService.getUsers(getUsersRequest).pipe(catchError(() => of(null)));
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
      error: this.alertService.handleErrors.bind(this)
    });
  }



  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  triggerReRender() {
    console.log("do something", this.test)
  }
}
