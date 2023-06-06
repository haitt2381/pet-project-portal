import {BehaviorSubject} from 'rxjs';
import {Injectable} from "@angular/core";
import {QueryParamsUser} from "../model/common/query-params-user";
import {
  APP_DEFAULT_PAGE_INDEX,
  APP_DEFAULT_PAGE_SIZE,
  APP_DEFAULT_SORT_ACTIVE,
  APP_DEFAULT_SORT_DIRECTION
} from "../../app.constant";

@Injectable({providedIn: 'root'})
export class QueryStorageService {
  private _itemName: string = 'queryItem';
  item: any = new BehaviorSubject(this.getItem);

  set setItem(value: QueryParamsUser) {
    localStorage.setItem(this._itemName, JSON.stringify(value));
    this.item.next(value); // this will make sure to tell every subscriber about the change.
  }

  get getItem() {
    return JSON.parse(localStorage.getItem(this._itemName)) ? JSON.parse(localStorage.getItem(this._itemName)) : {};
  }

  initData() {
    let initData = {
      pageSize: APP_DEFAULT_PAGE_SIZE,
      pageIndex: APP_DEFAULT_PAGE_INDEX,
      sortActive: APP_DEFAULT_SORT_ACTIVE,
      sortDirection: APP_DEFAULT_SORT_DIRECTION,
    }
    localStorage.setItem(this._itemName, JSON.stringify(initData));
    this.item.next(initData);
  }

  removeItem() {
    localStorage.removeItem(this._itemName);
    this.initData()
  }
}
