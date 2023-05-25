import {Injectable} from "@angular/core";
import * as AppConstant from "../app.constant";
import {HttpClient} from "@angular/common/http";
import {User} from "../share/model/user/user.model";
import {AlertService} from "../share/services/alert.service";
import {CREATE_USER_SUCCESSFULLY} from "../share/constant/alert.constant";
import {Router} from "@angular/router";
import {GetUsersRequest} from "../share/model/user/GetUsersRequest.model";
import {isNullOrUndefined} from "../share/services/Utils.service";
import {Title} from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
export class UserService {
  public userUrl = AppConstant.SERVER_API_URL + 'api/user/';
  public users: User[] = [];

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
      this.alertService.success(CREATE_USER_SUCCESSFULLY);
      this.router.navigate(["/user"]).then();
    }
  }

  createUser(newUser: User) {
    this.http.post(this.userUrl + 'create', newUser).subscribe({
      next: this.handleCreateUser.bind(this),
      error: this.alertService.handleErrors.bind(this)
    })
  }

  getUsers(request?: GetUsersRequest) {
    if (isNullOrUndefined(request)) {
      request = new GetUsersRequest(null);
    }
    return this.http.post(this.userUrl + 'list', request);
  }
}
