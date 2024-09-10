import { Component, OnInit } from '@angular/core';
import MockCardadAPI  from '../../../mocks/API/MockAPI'
import { JobModel, UserModel } from 'cardad-db';
import { BehaviorSubject, map, Observable, of, Subject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatTableModule, NgIf, AsyncPipe],
  providers:[MockCardadAPI],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser?: UserModel;
  jobDataSource: BehaviorSubject<JobModel[]> = new BehaviorSubject<JobModel[]>([]);
  expandedElement!: JobModel;
  displayedJobColumns: string[] = ['jobName', 'customerName', 'invoices'];
  constructor(private cardadApi: MockCardadAPI) {
    
  }
  ngOnInit(): void {
    this.getMe();
    this.getJobs();
  }

  getMe(){
    this.cardadApi.getMe().subscribe((resp) => {
      // if errors then log them
      if (resp.errors?.length) {
        console.log(resp.errors.slice(1).reduce((prev, curr) => prev + ", " + curr.message, resp.errors[0].message ))
      }
      //set current user
      this.currentUser = resp.data;
    })
  }

  getJobs(): void {
     this.cardadApi.getJobs(1, 100).subscribe(val => this.jobDataSource.next(val.data ?? []))
  }
}
