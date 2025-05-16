import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule, MatListItem } from '@angular/material/list';
import { IJob } from 'cardad-db';
import { on } from 'events';

@Component({
  selector: 'app-active-jobs-panel',
  standalone: true,
  imports: [NgFor, NgIf, MatListModule, MatListItem],
  templateUrl: './active-jobs-panel.component.html',
  styleUrl: './active-jobs-panel.component.scss'
})
export class JobsPanelComponent {
  @Input() jobs?: Array<IJob> = [];
  @Output() onAction = new EventEmitter<IJob>();

  onActionClick(job: IJob) {
    // Handle action for the job.
    console.log('Action for job:', job);
    this.onAction.emit(job);
  }
}
