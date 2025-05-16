import { DataSource } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { IJob, IVehicle, IUser } from "cardad-db";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { CurrencyPipe } from "@angular/common";
import { BehaviorSubject, Observable, map, tap, catchError, of } from "rxjs";
import MockCardadAPI from "../../../mocks/API/MockAPI";
import { CarIssueDetailsComponent } from "../../components/car-issue-details/car-issue-details.component";
import { JobsPanelComponent } from "../../components/active-jobs-panel/active-jobs-panel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, MatCardModule, CurrencyPipe, CarIssueDetailsComponent, JobsPanelComponent],
  providers: [MockCardadAPI],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  showCarIssueDetails: boolean = false;
  carIssue: IJob | null = null;
  cars: Array<IVehicle> = [];
  selectedUser?: IUser | undefined;
  selectedCar?: IVehicle | undefined;
  activeJobs?: Array<IJob> = [];

  issueDialogRef?: MatDialogRef<CarIssueDetailsComponent>

  constructor(private cardadAPI: MockCardadAPI, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.cardadAPI.getMe().subscribe(val => this.selectedUser = val.data);
    this.cardadAPI.getVehicles().subscribe(veh => {
      this.cars = veh.data ?? [];
      this.selectedCar = veh.data ? veh.data[0] : undefined;
    });
    this.cardadAPI.getJobs(1, 10).subscribe(jobs => {
      this.activeJobs = jobs.data ?? [];
    });
  }

  openCarIssueDetails() {
    // Logic to open car issue details
    this.issueDialogRef = this.matDialog.open(CarIssueDetailsComponent, {
      data: {
        vehicleModel: this.selectedCar,
        userModel: this.selectedUser,
      },
      width: '600px',
      height: '400px'
    });
    this.issueDialogRef.componentInstance.jobCreated.subscribe((job: IJob) => {
      this.cardadAPI.createJob(job).subscribe((resp) => {
        if (resp.errors?.length) {
          console.error(
            resp.errors
              .slice(1)
              .reduce((prev, curr) => prev + ', ' + curr.message, resp.errors[0].message)
          );
        } else {
          if (resp.data) {
            this.activeJobs?.push(resp.data);
          }
        }
      });
    });
  }

  get activeJobCount(): number {
    return this.activeJobs ? this.activeJobs.length : 0;
  }
}
