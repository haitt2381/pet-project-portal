import {PopConfirmConstant} from "../../constant/pop-confirm.constant";
import {ThemePalette} from "@angular/material/core";

export class PopConfirmAction {
  text: string;
  color: ThemePalette;

  constructor(text: PopConfirmConstant, color: ThemePalette) {
    this.text = text;
    this.color = color;
  }
}
