import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IJob, IUser, IVehicle } from 'cardad-db';
import { CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface CarIssueDetailsData {
  vehicleModel: IVehicle;
  userModel: IUser;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-car-issue-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    NgIf,
    NgFor,
    CurrencyPipe
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }, // Optional
  ],
  templateUrl: './car-issue-details.component.html',
  styleUrls: ['./car-issue-details.component.scss']
})
export class CarIssueDetailsComponent {
  @Input() vehicleModel?: IVehicle;
  @Input() userModel?: IUser;
  @Output() jobCreated = new EventEmitter<IJob>();
  @Output() onClose = new EventEmitter<void>();

  issueForm: FormGroup;
  stepIndex = 0; // Tracks the current step
  concernOptions = ['Smell', 'Sound', 'Dash Light', 'Vibration or Shaking', 'Other'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CarIssueDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CarIssueDetailsData
  ) {
    if (data) {
      this.vehicleModel = data.vehicleModel;
      this.userModel = data.userModel;
    }
    this.issueForm = this.fb.group({
      isCorrectCar: [null, Validators.required],
      concernType: ['', Validators.required],
      issueDescription: ['', [Validators.required, Validators.minLength(10)]],
      problemStartDate: [new Date(), Validators.required]
    });
  }

  nextStep() {
    if (this.stepIndex < 3) {
      this.stepIndex++;
    }
  }

  previousStep() {
    if (this.stepIndex > 0) {
      this.stepIndex--;
    }
  }

  submitIssue() {
    if (this.issueForm.valid) {
      if (!this.vehicleModel || !this.userModel) {
        throw new Error("Vehicle or user model is not provided");
      }
      const jobModel = {
        jobName: `Issue for ${this.vehicleModel.name}`,
        customer: this.userModel,
        vehicle: this.vehicleModel,
        issueDetails: this.issueForm.value
      } as IJob;
      this.jobCreated.emit(jobModel);
      this.closeComponent();
    }
  }

  getControl(name: string) {
    return this.issueForm.get(name) ?? new FormControl() as FormControl;
  }

  closeComponent() {
    this.issueForm.reset();
    this.onClose.emit();
    this.dialogRef.close();
  }
}
