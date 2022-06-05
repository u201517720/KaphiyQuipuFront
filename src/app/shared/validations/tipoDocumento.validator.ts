import { FormGroup } from "@angular/forms";

export function TipoDocumentoValidator(controlName: string, validateControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const validateControl = formGroup.controls[validateControlName];

        if (validateControl.errors && !validateControl.errors.mustMatch) {
            return;
        }

        if (control.value === '01' && validateControl.value.trim().length !== 8 ) {
            validateControl.setErrors({ mustMatch: true });
            return;
        }

        
        if (control.value === '02'  && validateControl.value.trim().length !== 11 ) {
            validateControl.setErrors({ mustMatch: true });
            return;
        }
        
        validateControl.setErrors(null);
    }
}