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
  public userUrl = AppConstant.SERVER_API_URL + '/user';

  constructor(
    private _http: HttpClient,
    private _alertService: AlertService,
    private _router: Router,
    private _titleService: Title,
  ) {
    _titleService.setTitle("User management")
  }

  handleSaveUserSuccess(resData) {
    if (resData.id) {
      this._alertService.success(Alert.CREATE_USER_SUCCESSFULLY);
      this._router.navigate(["/user"]).then();
    }
  }

  createUser(newUser: User) {
    this._http.post(`${this.userUrl}/create`, newUser).subscribe({
      next: this.handleSaveUserSuccess.bind(this),
      error: this._alertService.handleErrors.bind(this)
    })
  }

  updateUser(user: User) {
    this._http.put(`${this.userUrl}/update`, user).subscribe({
      next: this.handleSaveUserSuccess.bind(this),
      error: this._alertService.handleErrors.bind(this),
    })
  }

  getUsers(request?: GetUsersRequest) {
    if (isNullOrUndefined(request)) {
      request = new GetUsersRequest(null);
    }
    return this._http.post(`${this.userUrl}/list`, request);
  }

  getUser(id: string) {
    return this._http.get(`${this.userUrl}/${id}`);
  }

  toggleStatusUser(id: string, status: boolean) {
    let urlToggleStatusUser;
    if(status) {
      urlToggleStatusUser = `${this.userUrl}/deactivate/${id}`;
    } else {
      urlToggleStatusUser = `${this.userUrl}/activate/${id}`;
    }
    return this._http.get(urlToggleStatusUser);
  }
}
