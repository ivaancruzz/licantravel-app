import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';

@Component({
  selector: 'app-set-password',
  imports: [
    TuiTextfield,
    TuiForm,
    TuiIcon,
    TuiPassword,
    ReactiveFormsModule,
    TuiError,
    TuiFieldErrorPipe,
    AsyncPipe,
  ],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.scss',
})
export class SetPasswordComponent {
  @Output() onChange = new EventEmitter<string>();

  form: FormGroup;
  passwordValidations = {
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.validatePassword();
      this.emitChange();
    });
  }

  validatePassword() {
    const password = this.form.get('password')?.value || '';
    this.passwordValidations.hasMinLength = password.length >= 8;
    this.passwordValidations.hasUpperCase = /[A-Z]/.test(password);
    this.passwordValidations.hasLowerCase = /[a-z]/.test(password);
    this.passwordValidations.hasNumber = /[0-9]/.test(password);
    this.passwordValidations.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
      password
    );
  }

  emitChange() {
    const isValid =
      this.form.valid &&
      this.form.get('password')?.value ===
        this.form.get('repeatPassword')?.value;
    if (isValid) {
      this.onChange.emit(this.form.get('password')?.value);
    } else {
      this.onChange.emit('');
    }
  }
}
