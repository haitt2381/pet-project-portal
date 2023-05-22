import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SidebarService} from "./sidebar.service";
import {AppState} from "../store/app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

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
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.sidebarService.drawerSidebar = this.drawerSidebar;
    this.userSub = this.store.select("auth").subscribe(auth => {
      this.isAuthenticated = auth.isAuthenticate;
    });

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
