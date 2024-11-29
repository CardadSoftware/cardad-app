import { DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { JobModel } from "cardad-db";
import { BehaviorSubject, Observable, map, tap, catchError, of } from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  providers: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    
  }
}
