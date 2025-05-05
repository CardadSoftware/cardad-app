import { DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { NgFor } from "@angular/common";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { IJob, IVehicle, JobModel, IUser } from "cardad-db";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { CurrencyPipe } from "@angular/common";
import { BehaviorSubject, Observable, map, tap, catchError, of } from "rxjs";
import MockCardadAPI from "../../../mocks/API/MockAPI";
import { CarIssueDetailsComponent } from "../car-issue-details/car-issue-details.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, MatButtonModule, MatCardModule, CurrencyPipe, CarIssueDetailsComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  showCarIssueDetails: boolean = false;
  carIssue: IJob | null = null;
  cars: Array<IVehicle> = [];
  selectedUser?: IUser | undefined;
  selectedCar?: IVehicle | undefined;
  constructor(private cardadAPI: MockCardadAPI) {}

  ngOnInit(): void {
    this.cardadAPI.getMe().subscribe(val => this.selectedUser = val.data);
    this.cardadAPI.getVehicles().subscribe(veh => {
      this.cars = veh.data ?? [];
      this.selectedCar = veh.data ? veh.data[0] : undefined;
    });
  }

  openCarIssueDetails() {
    // Logic to open car issue details
    this.showCarIssueDetails = true;
  }

  closeCarIssueDetails(job: IJob) {
    // Logic to close car issue details
    this.showCarIssueDetails = false;
  }
}
