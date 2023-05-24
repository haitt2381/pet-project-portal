import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {map, Subscription} from "rxjs";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {logout} from "../auth/store/auth.action";
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
    private store: Store<AppState>,
    private sidebarService: SidebarService,
    private headerTitleService: HeaderTitleService,
  ) {}

  ngOnInit() {
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });

    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.auth))
      .subscribe(user => {
        this.isAuthenticated = !!user
      })

    this.isOpenSidebar = this.sidebarService.drawerSidebar.opened;
  }

  ngOnDestroy() {
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.store.dispatch(logout())
  }

  onToggleSidebar() {
    this.sidebarService.drawerSidebar.toggle();
    this.isOpenSidebar = this.sidebarService.drawerSidebar.opened;
  }
}
