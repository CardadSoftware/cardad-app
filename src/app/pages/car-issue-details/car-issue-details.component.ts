import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IJob, IUser, IVehicle, JobModel } from 'cardad-db';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-car-issue-details',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CurrencyPipe],
  templateUrl: './car-issue-details.component.html',
  styleUrls: ['./car-issue-details.component.scss']
})
export class CarIssueDetailsComponent {
  @Input() vehicleModel?: IVehicle; // Replace `any` with the appropriate type
  @Input() userModel?: IUser; // Replace `any` with the appropriate type
  @Output() jobCreated = new EventEmitter<IJob>(); // Emits the created JobModel object

  issueForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.issueForm = this.fb.group({
      issueDescription: ['', [Validators.required, Validators.minLength(10)]],
      urgency: ['', Validators.required],
      preferredDate: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  submitIssue() {
    if (this.issueForm.valid) {
      if (this.vehicleModel === undefined) {
        throw new Error("Vehicle model is not provided");
      }
      if (this.userModel === undefined) {
        throw new Error("User model is not provided");
      }
        const jobModel = new JobModel({
          jobName: `Issue for ${this.vehicleModel.name}`,
          customer: this.userModel,
          vehicle: this.vehicleModel,
          issueDetails: this.issueForm.value
        })
        this.jobCreated.emit(jobModel);
        this.issueForm.reset();
    }
  }
}
