import {PopConfirmAction} from "./pop-comfirm-action.model";
import {PopConfirmConstant} from "../../constant/pop-confirm.constant";

export class PopConfirmModel {
  content: string;
  actions: PopConfirmAction[];


  constructor(content: string, actions?: PopConfirmAction[]) {
    let actionsDefault = [
      new PopConfirmAction(PopConfirmConstant.TEXT_CANCEL, PopConfirmConstant.COLOR_PRIMARY),
      new PopConfirmAction(PopConfirmConstant.TEXT_OK, PopConfirmConstant.COLOR_WARN)
    ];
    this.content = content;
    this.actions = actions ? actions : actionsDefault;
  }
}
