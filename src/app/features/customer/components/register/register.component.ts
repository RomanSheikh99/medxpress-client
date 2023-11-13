/**
 * Component for registering a new customer.
 * Allows the user to enter their personal information, email, and password to create a new account.
 * Uses Angular Reactive Forms for form validation and submission.
 * Uses CustomerServicesService to communicate with the server and register the customer.
 * Uses HotToastService to display success and error messages to the user.
 */
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerRegister } from '../../models/customer-register';
import { CustomerServicesService } from '../../services/customer-services.service';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import {
  getToastErrorMessage,
  getToastSuccessMessage,
} from 'src/app/shared/utilityFunctions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  step = 1;
  private toastService = inject(HotToastService);
  registrationCompleted: boolean = false;

  ngOnInit(): void {
    this.getLocation();
  }

  /**
   * FormGroup instance for the registration form.
   * Contains form controls for first name, last name, email, password, address, postal code, and role.
   */
  registrationForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', Validators.required],
    role: ['CUSTOMER'],
    lat: 23.793802719868392,
    lng: 90.424322795238,
  });
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerServicesService,
    private router: Router
  ) { }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.registrationForm.patchValue({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
      console.log(
        'lat:',
        this.registrationForm.get('lat')?.value,
        'lng: ',
        this.registrationForm.get('lng')?.value
      );
    } else {
      console.error('No support for geolocation');
      this.toastService.error('Something went wrong', getToastErrorMessage());
    }
  }

  /**
   * Checks if a given field in the registration form is invalid.
   * @param fieldName - The name of the field to check.
   * @returns True if the field is invalid and has been touched or modified, false otherwise.
   */
  isFieldInvalid(fieldName: string | number): boolean {
    const fieldControl = this.registrationForm.get(String(fieldName));

    if (fieldControl) {
      return (
        fieldControl.invalid && (fieldControl.dirty || fieldControl.touched)
      );
    }

    // If null or undefined or invalid
    return false;
  }

  /**
   * Increases the current step of the registration process by 1.
   */
  increaseStep() {
    this.step++;
  }

  /**
   * Handles the submission of the email form step.
   * If step 1 and email is valid, checks for duplicate email.
   * If step 2 is valid, proceeds to step 3.
   * If step 3 and registration form is valid, completes registration.
   */
  onEmailSubmit() {
    if (this.step === 1 && this.registrationForm.get('email')?.valid) {
      const email: string = this.registrationForm.get('email')?.value ?? '';

      // Check for duplicate email
      this.customerService.checkDuplicateEmail(email).subscribe({
        next: (data) => {
          this.increaseStep();
        },
        error: (error) => {
          if (error.status === 409) {
            this.registrationForm.get('email')?.setErrors({ duplicate: true });
            this.toastService.error(
              'Email already exists. Please use a different email.',
              getToastErrorMessage()
            );
          } else {
            console.error(error);
            this.toastService.error(
              'Something went wrong. Please try again later.',
              getToastErrorMessage()
            );
          }
        },
      });
    } else if (this.step === 2) {
      // Proceed to the next step (Step 3 or final step) when step 2 is valid
      this.step = 3;
    } else if (this.step === 3 && this.registrationForm.valid) {
      // Complete registration on the final step
      this.registrationFormSubmit();
    }
  }

  /**
   * Submits the registration form if it is valid and registers the customer using the customer service.
   * If the registration is successful, it increases the step, saves the access token, and shows a success toast.
   * If there is an error, it logs the error, resets the form, and shows an error toast.
   * Finally, it sets the registrationCompleted flag to true.
   */
  registrationFormSubmit() {
    if (this.registrationForm.valid) {
      const { firstName, lastName, email, password, address, role, lat, lng } = this.registrationForm.value
      const customerData: CustomerRegister = {
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!,
        address: address!,
        role: role!,
        lat: lat!,
        lng: lng!,
      };

      this.customerService.registerCustomer(customerData).subscribe({
        next: (data) => {
          this.increaseStep();
          this.customerService.saveAccessToken(
            data.access_token,
            data.expires_in
          );
          this.increaseStep();

          this.toastService.success(
            'Registration Successful',
            getToastSuccessMessage()
          );
        },
        error: (error) => {
          console.error(error);
          this.registrationForm.reset();
          this.toastService.error(
            'Something Went Wrong',
            getToastErrorMessage()
          );
        },
        complete: () => {
          this.registrationCompleted = true;
        },
      });
    }
  }

  /**
   * Navigates to the home page when the home button is clicked.
   */
  HandleHomeBtnClick() {
    this.router.navigate(['/home']);
  }
}
