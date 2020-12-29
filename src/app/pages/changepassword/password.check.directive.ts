import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[ngx_validateCheck][formControlName],[ngx_validateCheck][formControl],[ngx_validateCheck][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => CheckValidator), multi: true }],
})

export class CheckValidator implements Validator {
  constructor( @Attribute('ngx_validateCheck') public ngx_validateCheck: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
    // self value (e.g. retype password)
    const v = c.value;

    // control value (e.g. password)
    const e = c.root.get(this.ngx_validateCheck);

    // value not equal
    if (e && v !== e.value) {
      return ({ngx_validateCheck: false});
    }
    return null;
  }
}
