import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-provider',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ],
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent {
  providerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.providerForm = this.fb.group({
      name: ['', Validators.required],
      type: ['baremetal', Validators.required],
      hasAgent: [true],
      bmcProtocol: ['ipmi'],
      bmcAddress: [''],
      bmcUsername: [''],
      bmcPassword: ['']
    });

    // Add validators to BMC fields when hasAgent is false
    this.providerForm.get('hasAgent')?.valueChanges.subscribe(hasAgent => {
      const bmcAddress = this.providerForm.get('bmcAddress');
      const bmcUsername = this.providerForm.get('bmcUsername');
      const bmcPassword = this.providerForm.get('bmcPassword');

      if (!hasAgent) {
        bmcAddress?.setValidators([Validators.required]);
        bmcUsername?.setValidators([Validators.required]);
        bmcPassword?.setValidators([Validators.required]);
      } else {
        bmcAddress?.clearValidators();
        bmcUsername?.clearValidators();
        bmcPassword?.clearValidators();
      }

      bmcAddress?.updateValueAndValidity();
      bmcUsername?.updateValueAndValidity();
      bmcPassword?.updateValueAndValidity();
    });
  }

  get showBmcFields() {
    return !this.providerForm.get('hasAgent')?.value;
  }

  onSubmit() {
    if (this.providerForm.valid) {
      console.log('Provider data:', this.providerForm.value);
      // TODO: Implement API call to save provider
      this.router.navigate(['/providers']);
    }
  }
}
