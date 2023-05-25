import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../share/model/user/user.model";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {UserService} from "../user.service";
import {switchMap} from "rxjs";
import {AlertService} from "../../share/services/alert.service";
import {GetUserResponse} from "../../share/model/user/get-user-response.model";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userIdSelected: string;
  userSelected: User;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.userIdSelected = this._route.snapshot.paramMap.get('id');
    this._userService.getUser(this.userIdSelected).subscribe({
      next: (resData: GetUserResponse) => {
        this.userSelected = resData.data;

        let user = new User();
        user.firstName = this.userSelected?.firstName;
        user.lastName = this.userSelected?.lastName;
        user.email = this.userSelected?.email;
        user.phoneNumber = this.userSelected?.phoneNumber;
        user.username = this.userSelected?.username;
        user.role = this.userSelected?.role;
        this.initForm(user);
      },
      error: err => {
        this._alertService.handleErrors(err)
      },
    });
    let user = new User();
    this.initForm(user);
  }

  private initForm(user: User) {
    this.userForm = this._fb.group({
      firstName: [user?.firstName, Validators.required],
      lastName: [user?.lastName, Validators.required],
      email: [user?.email, [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber, Validators.required],
      username: [user?.username, Validators.required],
      password: ['', Validators.required],
      role: [user?.role, Validators.required]
    })
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      this._userService.createUser(this.userForm.value);
    }
  }

  onCancelEditUser() {
    this._router.navigate(['../'], {relativeTo: this._route}).then();
  }
}
