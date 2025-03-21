import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.component.html',
})
export class BasicPageComponent {
  //! Forma "tradicional" de crear formularios.
  //! También para indicar el tipo de dato podría ser: new FormGroup<type>(initialization)
  // myForm = new FormGroup({
  //   name: new FormControl('', [], []),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  //   //! El problema viene si se requiriera un nivel más de indentación, ya que se tendría que agregar un nuevo FormGroup
  //   address: new FormGroup({
  //     street: new FormControl(''),
  //   }),
  // });

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    /*
    ! propertieName: [ VALOR_INICIAL, VALIDADORES_SÍNCRONOS (SI SOLO ES UNO NO REQUIERE CORCHETES), VALIDADORES_ASÍNCRONOS ]
    */
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(10)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  //! Se movió a la clase FormUtils
  //x isValidField(fieldName: string): boolean | null {
  //x   return (
  //x     this.myForm.controls[fieldName].errors &&
  //x     this.myForm.controls[fieldName].touched
  //x   );
  //x }

  //! Se movió a la clase FormUtils
  //x getFieldError(fieldName: string): string | null {
  //x   if (!this.myForm.controls[fieldName]) return null;

  //x   const errors = this.myForm.controls[fieldName].errors ?? {};

  //x   for (const key of Object.keys(errors)) {
  //x     switch (key) {
  //x       case 'required':
  //x         return 'Este campo es requerido';
  //x       case 'minlength':
  //x         return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
  //x       case 'min':
  //x         return `Valor mínimo de ${errors['min'].min}`;
  //x     }
  //x   }

  //x   return null;
  //x }

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);

    this.myForm.reset({
      price: 0,
      inStorage: 0,
    });
  }
}
