import {Component, OnInit} from '@angular/core';
import {User} from "../share/model/user/user.model";
import {Router} from "@angular/router";
import {UserService} from "./user.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit{

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.userService.getUsers();
  }

  onEditUser(user: User) {
    this.router.navigate(['user','new']).then();
  }
}
