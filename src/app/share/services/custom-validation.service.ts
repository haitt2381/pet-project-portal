import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  public regex =
    {
      email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$' ,
      pin : '^[0-9]{6}$'
    }
  constructor(private form: FormGroup) {
  }

  isRequired(fieldName: string) {
    return this.form.controls[fieldName].hasError('required')
  }

}
