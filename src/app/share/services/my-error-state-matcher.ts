import {ErrorStateMatcher} from "@angular/material/core";
import {AbstractControl, FormGroup, FormGroupDirective, NgForm} from "@angular/forms";

export class MyErrorStateMatcher implements ErrorStateMatcher {

  constructor(private form: FormGroup) {
  }
  isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  isRequired(fieldName: string) {
    return this.form.controls[fieldName].hasError('required')
  }

}
