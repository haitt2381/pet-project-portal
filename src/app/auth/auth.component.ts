import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {MyErrorStateMatcher} from "../share/services/my-error-state-matcher";
import {AlertService} from "../share/services/alert.service";
import {ResponseInfo} from "../share/model/common/response-info.model";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {AuthResponseData} from "../share/model/auth/auth-reponse-data.model";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  responseInfo: ResponseInfo = null;

  authForm: FormGroup;
  matcher: MyErrorStateMatcher;


  constructor(
    private _fb: FormBuilder,
    private _alertService: AlertService,
    private _authService: AuthService,
    private _router: Router,
  ) {
  }

  ngOnInit() {
    this.authForm = this._fb.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required]
      }
    )

    this.matcher = new MyErrorStateMatcher(this.authForm);
  }

  onSubmitLogin() {
    if (!this.authForm.valid) {
      return;
    }

    const emailOrUsername = this.authForm.value.username;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this._authService.login(emailOrUsername, password);
    }

    authObs.subscribe({
      next: () => {
        this.isLoading = false;
        this._router.navigate(['/']).then();
      },
      error: err => {
        this.isLoading = false;
        this._alertService.handleErrors(err)
      }
      }
    );
  }
}
