import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'pet-project';

  constructor(
    private _titleService:Title,
    private _authService: AuthService,
    ) {
    this._titleService.setTitle(this.title);
  }

  ngOnInit() {
    this._authService.autoLogin();
  }
}
