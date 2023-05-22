import {Component, OnInit} from '@angular/core';
import {AppState} from "./store/app.reducer";
import {Store} from "@ngrx/store";
import {autoLogin} from "./auth/store/auth.action";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pet-project';

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(autoLogin())
  }
}
