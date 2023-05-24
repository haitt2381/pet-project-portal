import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
import {CustomFilterComponent, DataSourceFilter} from "../share/UI/custom-filter/custom-filter.component";
import {HeaderTitleService} from "../header/header-title.service";
import {MdbCheckboxChange} from "mdb-angular-ui-kit/checkbox";
import {DomSanitizer} from "@angular/platform-browser";
import {MdbCheckboxDirective} from "mdb-angular-ui-kit/checkbox/checkbox.directive";

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
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild("dropdownFilter", {static: true}) filter: any;
  dataSource: MatTableDataSource<User>;
  @ViewChild(CustomFilterComponent, {static: true}) customFilter: CustomFilterComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private headerService: HeaderTitleService,
  ) {
    headerService.setTitle("USER MANAGEMENT")
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params)
    })
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
    return merge(this.sort.sortChange, this.paginator.page, this.customFilter.dropdownFilter.dropdownHidden).pipe(
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
        console.log("called observer")
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

  handleCheckboxChange() {
    // this.loadDataWithQueryParam();
    // console.log(this.filter)
    // this.isLoading = true;
    // let sortInfo = new SortInfo(this.sort.direction, this.sort.active);
    // let requestInfo = new RequestInfo(this.paginator.pageIndex, this.paginator.pageSize, sortInfo);
    // let getUsersRequest = new GetUsersRequest("", requestInfo);
    // this.userService.getUsers(getUsersRequest).subscribe({
    //   next: (resData: GetUsersResponse) => {
    //     this.users = resData.data;
    //     this.responseInfo = resData.responseInfo;
    //     this.isLoading = false;
    //   },
    //   error: this.alertService.handleErrors.bind(this)
    // })
    let queryParams = {
      role: null,
    };
    // if(filter.checked) {
    //   queryParams = {
    //     role: event.element.value
    //   }
    // }

    this.router.navigate(['/user'], {queryParams: queryParams, queryParamsHandling: 'merge'}).then();
  }
}
