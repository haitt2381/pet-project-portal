import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./user/user.component";
import {AuthComponent} from "./auth/auth.component";
import {UserEditComponent} from "./user/user-edit/user-edit.component";
import {AuthGuard} from "./auth/auth.guard";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {
    path: 'user', canActivate: [AuthGuard], children: [
      {path: '', component: UserComponent},
      {path: 'new', component: UserEditComponent},
      {path: 'edit/:id', component: UserEditComponent}
    ]
  },
  {path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
