import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SidebarService} from "./sidebar.service";
import {Subscription} from "rxjs";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', {static: true}) drawerSidebar: any;
  isAuthenticated: boolean;
  userSub: Subscription

  constructor(
    private sidebarService: SidebarService,
    private _authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.sidebarService.drawerSidebar = this.drawerSidebar;
    this.userSub = this._authService.userLogged.subscribe(user => {
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
