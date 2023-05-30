import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PopConfirmModel} from "../../../model/UI/pop-confirm.model";
import {ThemePalette} from "@angular/material/core";

@Component({
  selector: 'app-pop-confirm',
  templateUrl: './pop-confirm.component.html',
  styleUrls: ['./pop-confirm.component.scss']
})
export class PopConfirmComponent {
  color: ThemePalette;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopConfirmModel,
    public dialogRef: MatDialogRef<PopConfirmComponent>,
  ) {
  }

  onConfirmModel(actionHTML: string) {
    this.dialogRef.close(actionHTML);
  }
}
