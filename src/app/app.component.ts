import {Component, OnInit} from '@angular/core';
import {AppState} from "./store/app.reducer";
import {Store} from "@ngrx/store";
import {autoLogin} from "./auth/store/auth.action";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pet-project';

  constructor(
    private store: Store<AppState>,
    private titleService:Title,
    ) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit() {
    this.store.dispatch(autoLogin())
  }
}
