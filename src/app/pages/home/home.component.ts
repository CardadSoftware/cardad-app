import { Component, OnInit, ViewChild } from '@angular/core';
import MockCardadAPI from '../../../mocks/API/MockAPI';
import { JobModel, UserModel } from 'cardad-db';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule} from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, AsyncPipe, MatPaginator, MatSort],
  providers: [MockCardadAPI],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentUser?: UserModel;
  expandedElement: JobModel | null = null;
  jobDataSource!: JobDataSource;
  loading: boolean = false;
  displayedJobColumns: string[] = ['jobName', 'customerName'
    , 'invoices'
  ];

  constructor(private cardadApi: MockCardadAPI) {}

  ngOnInit(): void {
    this.getMe();
    this.jobDataSource = new JobDataSource(this.cardadApi);
    // Connect paginator and sort after the view initializes
    setTimeout(() => {
      this.jobDataSource.setPaginator(this.paginator);
      this.jobDataSource.setSort(this.sort);
    });
  }

  getMe(): void {
    this.cardadApi.getMe().subscribe((resp) => {
      if (resp.errors?.length) {
        console.error(
          resp.errors
            .slice(1)
            .reduce((prev, curr) => prev + ', ' + curr.message, resp.errors[0].message)
        );
      }
      this.currentUser = resp.data;
    });
  }

  toggleRow(element: JobModel): void {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}

export class JobDataSource extends DataSource<JobModel> {
  private dataSubject = new BehaviorSubject<JobModel[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  private paginator!: MatPaginator;
  private sort!: MatSort;

  data$ = this.dataSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(private cardadApi: MockCardadAPI) {
    super();
  }

  setPaginator(paginator: MatPaginator): void {
    this.paginator = paginator;
    this.updateData();
  }

  setSort(sort: MatSort): void {
    this.sort = sort;
    this.updateData();
  }

  connect(): Observable<JobModel[]> {
    this.loadingSubject.next(true);

    return this.cardadApi.getJobs(1, 100).pipe(
      map((response) => response.data ?? []),
      tap((data) => {
        this.dataSubject.next(data);
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.errorSubject.next(error.message);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
  }

  private updateData(): void {
    if (!this.paginator || !this.sort) return;

    const data = this.dataSubject.value.slice();

    // Apply sorting
    const sortedData = this.sortData(data);

    // Apply pagination
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const paginatedData = sortedData.slice(startIndex, startIndex + this.paginator.pageSize);

    this.dataSubject.next(paginatedData);
  }

  private sortData(data: JobModel[]): JobModel[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'jobName':
          return compare(a.jobName, b.jobName, isAsc);
        case 'customerName':
          return compare(
            a.customer?.firstName || '',
            b.customer?.firstName || '',
            isAsc
          );
        default:
          return 0;
      }
    });
  }
}

function compare(a: String | number, b: String | number, isAsc: boolean): number {
  return (a < b ? -1 : a > b ? 1 : 0) * (isAsc ? 1 : -1);
}
