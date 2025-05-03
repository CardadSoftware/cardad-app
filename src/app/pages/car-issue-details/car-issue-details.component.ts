import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-car-issue-details',
  standalone: true,
  imports: [],
  templateUrl: './car-issue-details.component.html',
  styleUrls: ['./car-issue-details.component.scss']
})
export class CarIssueDetailsComponent {
  @Input() vehicleModel: any; // Replace `any` with the appropriate type
  @Input() userModel: any; // Replace `any` with the appropriate type
  @Output() jobCreated = new EventEmitter<any>(); // Emits the created JobModel object

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
      const jobModel = {
        jobName: `Issue for ${this.vehicleModel.name}`,
        customer: this.userModel._id,
        vehicle: this.vehicleModel._id,
        issueDetails: this.issueForm.value
      };
      this.jobCreated.emit(jobModel);
    }
  }
}
