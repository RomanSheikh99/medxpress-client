import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerRegister } from '../../models/customer-register';
import { CustomerServicesService } from '../../services/customer-services.service';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  step = 1;
  private toastService = inject(HotToastService);
  registrationCompleted: boolean = false;

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', Validators.required],
    postalCode: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}$/), // exactly 4 digits
      ],
    ],
    role: ['CUSTOMER'],
  });
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerServicesService,
    private router: Router
  ) {}

  // Validate form
  isFieldInvalid(fieldName: string | number): boolean {
    const fieldControl = this.registerForm.get(String(fieldName));

    if (fieldControl) {
      return (
        fieldControl.invalid && (fieldControl.dirty || fieldControl.touched)
      );
    }

    // If null or undefined or invalid
    return false;
  }

  increaseStep() {
    this.step++;
  }

  registerFormSubmit() {
    if (this.registerForm.valid) {
      const customerData: CustomerRegister = {
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        address: this.registerForm.value.address!,
        postalCode: this.registerForm.value.postalCode!,
        role: this.registerForm.value.role!,
      };

      this.customerService.registerCustomer(customerData).subscribe({
        next: (data) => {
          console.log(data);
          this.increaseStep();
          this.customerService.saveAccessToken(
            data.access_token,
            data.expires_in
          );
          this.increaseStep();

          this.toastService.success('Registration Successful', {
            icon: '😀',
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #067A46',
              padding: '16px',
              color: '#067A46',
              background: '#D2F895',
              fontFamily: 'Agrandir-Regular',
            },
          });
        },
        error: (error) => {
          console.log(error);
          this.registerForm.reset();
          this.toastService.error('Something Went Wrong', {
            icon: '☹',
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #067A46',
              padding: '16px',
              color: '#067A46',
              background: '#D2F895',
              fontFamily: 'Agrandir-Regular',
            },
          });
        },
        complete: () => {
          this.registrationCompleted = true;
        },
      });
    }
    console.log('submitted', this.registerForm.value);
  }

  HandleHomeBtnClick() {
    this.router.navigate(['/home']);
  }
}
