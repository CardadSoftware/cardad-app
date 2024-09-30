import { Component, OnInit } from '@angular/core';
import MockCardadAPI  from '../../../mocks/API/MockAPI'
import { JobModel, UserModel } from 'cardad-db';
import { BehaviorSubject, catchError, map, Observable, of, startWith, Subject, tap } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, NgIf } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  expandedElement!: JobModel;
  jobDataSource!: JobDataSource;
  displayedJobColumns: string[] = ['jobName', 'customerName', 'invoices'];
  constructor(private cardadApi: MockCardadAPI) {
    
  }
  ngOnInit(): void {
    this.getMe();
    this.jobDataSource = new JobDataSource(this.cardadApi);
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
}

export class JobDataSource extends DataSource<JobModel> {
  private dataSubject = new BehaviorSubject<JobModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  data$ = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private cardadApi: MockCardadAPI) { 
    super();
  }

  connect(): Observable<JobModel[]> {
    this.loadingSubject.next(true);

    return this.cardadApi.getJobs(1, 100)
      .pipe(
        map((response) => response.data ?? []), // Handle potential empty response
        catchError((error) => {
          this.errorSubject.next(error.message);
          // Optionally handle other error scenarios here (e.g., retry logic)
          return of([]);
        }),
        startWith([]), // Emit initial empty array to prevent rendering issues before data arrives
        tap((data) => {
          this.dataSubject.next(data);
          this.loadingSubject.next(false);
        })
      );
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }
}
