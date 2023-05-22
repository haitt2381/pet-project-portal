import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../share/model/user.model";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  userIdSelected: string;
  userSelected: User;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    let firstname = ''
    let lastname = ''
    let email = ''
    let phoneNumber = ''
    let username = ''
    let password = ''

    this.userForm = this.fb.group({
      firstname: [firstname, Validators.required],
      lastname: [lastname, Validators.required],
      email: [email, [Validators.required, Validators.email]],
      phoneNumber: [phoneNumber, Validators.required],
      username: [username, Validators.required],
      password: [password, Validators.required],
    })
  }

  onSubmitUser() {
    console.log(this.userForm.value);
  }

  onCancelEditUser() {
    // this.activeModal.dismiss();
  }
}
