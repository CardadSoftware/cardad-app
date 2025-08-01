import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort'; // For table sorting (optional)
import { MatPaginatorModule } from '@angular/material/paginator'; // For table pagination (optional)
import { MatMenuModule } from '@angular/material/menu'; // For action menus in table rows

import { ICarModel, IVehicle } from 'cardad-db'; // Import our Car interface
import { CarDetailsComponent } from '../car-details/car-details.component'; // Import the car details dialog component
import { FormsModule } from '@angular/forms';
import { Types as mongooseTypes } from 'mongoose';

@Component({
  selector: 'app-my-garage',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule, // Add to imports
    MatPaginatorModule, // Add to imports
    MatMenuModule, // Add to imports
    CarDetailsComponent,
    FormsModule
  ],
  templateUrl: './my-garage.component.html',
  styleUrls: ['./my-garage.component.scss']
})
export class MyGarageComponent implements OnInit {
  cars: IVehicle[] = []; // Array to hold your car data
  displayedColumns: string[] = ['make', 'model', 'year', 'licensePlate', 'ownerManager', 'status', 'actions'];

  searchTerm: string = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // In a real app, you'd fetch this from a service
    this.cars = [...this.mockCars];
  }

  applyFilter(): void {
    this.cars = this.mockCars.filter(car =>
      car.make.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCarForm(car?: IVehicle): void {
    const dialogRef = this.dialog.open(CarDetailsComponent, {
      width: '600px', // Adjust width as needed
      data: car // Pass existing car data if editing, or undefined for new
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (e.g., save to backend, update local array)
        if (result.id) {
          // Editing existing car
          const index = this.cars.findIndex(c => c._id === result.id);
          if (index !== -1) {
            this.cars[index] = result; // Update the car in the array
          }
        } else {
          // Adding new car
          result.id = Date.now().toString(); // Simple ID generation for mock
          this.cars.push(result);
        }
        this.cars = [...this.cars]; // Trigger change detection for table
        this.applyFilter(); // Re-apply filter in case new/edited car matches
      }
    });
  }

  viewCarDetails(car: IVehicle): void {
    // In a real app, you might navigate to a details page
    // or open another detailed dialog
    alert(`Viewing Details for: ${car.name} ${car.model} (${car.licNumber})\nVIN: ${car.vin}`);
  }

  deleteCar(carId: string): void {
    if (confirm('Are you sure you want to delete this car?')) {
      // In a real app, you'd send a DELETE request to your backend
      this.cars = this.cars.filter(car => car._id.toString() !== carId);
      alert('Car deleted!');
    }
  }
}