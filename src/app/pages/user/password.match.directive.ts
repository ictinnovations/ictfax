import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[ngx_validateEqual][formControlName],[ngx_validateEqual][formControl],[ngx_validateEqual][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }],
})

export class EqualValidator implements Validator {
  constructor( @Attribute('ngx_validateEqual') public ngx_validateEqual: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
    // self value (e.g. retype password)
    const v = c.value;

    // control value (e.g. password)
    const e = c.root.get(this.ngx_validateEqual);

    // value not equal
    if (e && v !== e.value) {
      return ({ngx_validateEqual: false});
    }
    return null;
  }
}
