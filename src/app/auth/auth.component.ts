import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../store/app.reducer";
import {loginStart} from "./store/auth.action";
import {MyErrorStateMatcher} from "../share/my-error-state-matcher";
import {AlertService} from "../share/services/alert.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  private storeSub: Subscription;
  authForm: FormGroup;
  matcher: MyErrorStateMatcher;


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading
      console.log("loading: ", this.isLoading)
      this.error = authState.authError
      if(this.error) {
        this.alertService.error(this.error)
      }
    })


    this.authForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', Validators.required]
      }
    )

    this.matcher = new MyErrorStateMatcher(this.authForm);

    console.log(this.error)
  }

  onSubmitLogin() {
    if (!this.authForm.valid) {
      return;
    }

    const username = this.authForm.value.username;
    const password = this.authForm.value.password;

    this.isLoading = true;

    this.store.dispatch(
      loginStart({email: username, password: password})
    )
  }
}
