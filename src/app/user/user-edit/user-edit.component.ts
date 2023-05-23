import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../share/model/user/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";

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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    let firstName = ''
    let lastName = ''
    let email = ''
    let phoneNumber = ''
    let username = ''
    let password = ''
    let role = 'MEMBER'

    this.userForm = this.fb.group({
      firstName: [firstName, Validators.required],
      lastName: [lastName, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      phoneNumber: [phoneNumber, Validators.required],
      username: [username, Validators.required],
      password: [password, Validators.required],
      role: [role, Validators.required]
    })
  }

  onSubmitUser() {
    if (this.userForm.valid) {
      this.userService.createUser(this.userForm.value);
    }
  }

  onCancelEditUser() {
    this.router.navigate(['../'], {relativeTo: this.route}).then();
  }
}
