import {Component, OnInit} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {Router} from "@angular/router";
import {UserService} from "./user.service";
import {AlertService} from "../share/services/alert.service";
import {GetUsersResponse} from "../share/model/user/GetUsersResponse.model";
import {ResponseInfo} from "../share/model/common/ResponseInfo.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit{

  users: User[];
  responseInfo: ResponseInfo;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (resData: GetUsersResponse) => {
        this.users = resData.data;
        this.responseInfo = resData.responseInfo;
      },
      error: this.alertService.handleErrors.bind(this)
    });
  }

  onEditUser(user: User) {
    this.router.navigate(['user','new']).then();
  }
}
