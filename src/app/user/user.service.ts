import {Injectable} from "@angular/core";
import * as AppConstant from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {User} from "../share/model/user/user.model";
import {AlertService} from "../share/services/alert.service";
import {Router} from "@angular/router";
import {GetUsersRequest} from "../share/model/user/get-users-request.model";
import {isNullOrUndefined} from "../share/services/Utils.service";
import {Title} from "@angular/platform-browser";
import {Alert} from "../share/constant/alert.constant";

@Injectable({providedIn: 'root'})
export class UserService {
  public userUrl = AppConstant.SERVER_API_URL + 'api/user';

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    private titleService: Title,
  ) {
    titleService.setTitle("User management")
  }

  handleCreateUser(resData) {
    if (resData.id) {
      this.alertService.success(Alert.CREATE_USER_SUCCESSFULLY);
      this.router.navigate(["/user"]).then();
    }
  }

  createUser(newUser: User) {
    this.http.post(`${this.userUrl}/create`, newUser).subscribe({
      next: this.handleCreateUser.bind(this),
      error: this.alertService.handleErrors.bind(this)
    })
  }

  getUsers(request?: GetUsersRequest) {
    if (isNullOrUndefined(request)) {
      request = new GetUsersRequest(null);
    }
    return this.http.post(`${this.userUrl}/list`, request);
  }

  getUser(id: string) {
    return this.http.get(`${this.userUrl}/${id}`);
  }

  toggleStatusUser(email: string, status: boolean) {
    let urlToggleStatusUser;
    if(status) {
      urlToggleStatusUser = `${this.userUrl}/deactivate/${email}`;
    } else {
      urlToggleStatusUser = `${this.userUrl}/activate/${email}`;
    }
    return this.http.get(urlToggleStatusUser);
  }
}
