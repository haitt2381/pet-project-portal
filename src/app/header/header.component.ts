import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {SidebarService} from "../sidebar/sidebar.service";
import {HeaderTitleService} from "./header-title.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isOpenSidebar = false;
  userSub: Subscription
  title: string = '';

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService,
    private headerTitleService: HeaderTitleService,
  ) {
  }

  ngOnInit() {
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });

    this.authService.userLogged.subscribe(user => {
      this.isAuthenticated = !!user;
    })
    this.isOpenSidebar = this.sidebarService.drawerSidebar.opened;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout();
  }

  onToggleSidebar() {
    this.sidebarService.drawerSidebar.toggle();
    this.isOpenSidebar = this.sidebarService.drawerSidebar.opened;
  }
}
