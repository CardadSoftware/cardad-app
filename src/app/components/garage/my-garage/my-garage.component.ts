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

import { ICarModel } from 'cardad-db'; // Import our Car interface
import { CarDetailsComponent } from '../car-details/car-details.component'; // Import the car details dialog component
import { FormsModule } from '@angular/forms';

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
  cars: ICarModel[] = []; // Array to hold your car data
  displayedColumns: string[] = ['make', 'model', 'year', 'licensePlate', 'ownerManager', 'status', 'actions'];

  // Mock data for demonstration
  mockCars: ICarModel[] = [
    { id: '1', model: 'Camry', year: 2020, vin: 'ABC123DEF456GHI78', licensePlate: 'FL-A1B23', color: 'Silver', mileage: 45000  } as ICarModel,
    { id: '2', model: 'CR-V', year: 2022, vin: 'JKL987MNO654PQR32', licensePlate: 'FL-C4D56', color: 'Blue', mileage: 12000 } as ICarModel,
    { id: '3', model: 'F-150', year: 2018, vin: 'STU111VWX222YZA33', licensePlate: 'FL-E7F89', color: 'Black', mileage: 80000 } as ICarModel,
    { id: '4', model: 'Model 3', year: 2023, vin: 'BCD444EFG555HIJ66', licensePlate: 'FL-G1H23', color: 'Red', mileage: 5000 } as ICarModel,
    { id: '5', model: 'Rogue', year: 2019, vin: 'KLM777NOP888QRS99', licensePlate: 'FL-J4K56', color: 'White', mileage: 60000 } as ICarModel
  ];

  searchTerm: string = '';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // In a real app, you'd fetch this from a service
    this.cars = [...this.mockCars];
  }

  applyFilter(): void {
    this.cars = this.mockCars.filter(car =>
      car.make.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      car.vin.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openCarForm(car?: ICarModel): void {
    const dialogRef = this.dialog.open(CarDetailsComponent, {
      width: '600px', // Adjust width as needed
      data: car // Pass existing car data if editing, or undefined for new
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (e.g., save to backend, update local array)
        if (result.id) {
          // Editing existing car
          const index = this.cars.findIndex(c => c.id === result.id);
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

  viewCarDetails(car: ICarModel): void {
    // In a real app, you might navigate to a details page
    // or open another detailed dialog
    alert(`Viewing Details for: ${car.make.name} ${car.model} (${car.licensePlate})\nVIN: ${car.vin}`);
  }

  deleteCar(carId: string): void {
    if (confirm('Are you sure you want to delete this car?')) {
      // In a real app, you'd send a DELETE request to your backend
      this.cars = this.cars.filter(car => car.id !== carId);
      alert('Car deleted!');
    }
  }
}