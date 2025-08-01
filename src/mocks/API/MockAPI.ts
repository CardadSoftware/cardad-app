import { 
    IJob, 
    IUser, 
    IVehicle, 
    IShop, 
    IInvoice,
    ITechnician, 
    ICharge,
    ICarModel,
    ICarMake
} from 'cardad-db';

import { v4 as guidv4 } from 'uuid';
import { Observable, of, switchMap, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import {Types as mongooseTypes} from 'mongoose';

// Create test data using Mongoose models
const testUser: IUser = {
    _id: new mongooseTypes.ObjectId(),
    username: "anthony.stoute",
    firstName: "Anthony",
    lastName: "Stoute",
    email: "anthony.stoute@test.com",
    createDate: new Date(),
    active: true,
    online: true
} as IUser;

const testInvoice: IInvoice = {
    invoiceName: "Anthonys Invoice",
    description: "Fix Transfer Case Motor",
    referenceNumber: "RA-66772",
    totalCharge: 1600,
    shop: [] as IShop[],
    charges: [] as ICharge[],
} as IInvoice;

const testJobs: IJob[] = [
    {
        _id: new mongooseTypes.ObjectId(),
        jobName: "Engine Repair",
        customer: testUser,
        invoices: [] as IInvoice[],
        jobStatus: "In Progress",
    } as IJob,
    {
        _id: new mongooseTypes.ObjectId(),
        jobName: "Oil Change",
        customer: testUser,
        invoices: [testInvoice] as IInvoice[],
        jobStatus: "Diagnostics",
    } as IJob
];

const testShops: IShop[] = [
    {
        _id: new mongooseTypes.ObjectId(),
        name: "AutoFix",
        address: {
            streetAddress: "123 Main St",
            city: "Springfield",
            zip: "12345",
            state: "IL"
        },
        owner: "John Doe"
    } as IShop
];

const testTechnicians: ITechnician[] = [
    {
        _id: new mongooseTypes.ObjectId(),
        username: "tech1",
        firstName: "Jane",
        lastName: "Doe",
        specialties: [{ value: "Engine" }],
        bookable: true,
        rating: 5,
        certifications: ["ASE"],
        company: "AutoFix"
    } as ITechnician
];

const testCarMakes: ICarMake[] = [
  {
    _id: new mongooseTypes.ObjectId(),
    name: "Toyota",
    country: "Japan",
    establishedYear: 1937,
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: "Ford",
    country: "United States",
    establishedYear: 1903,
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: "BMW",
    country: "Germany",
    establishedYear: 1916,
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: "Hyundai",
    country: "South Korea",
    establishedYear: 1967,
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: "Ferrari",
    country: "Italy",
    establishedYear: 1939,
  },
];

const testCarModels: ICarModel[] = [
    { _id: new mongooseTypes.ObjectId(), name: 'Camry', make: testCarMakes.find(f => f.name == "Toyota"), year: 2020 } as ICarModel,
    { _id: new mongooseTypes.ObjectId(), name: 'F-150', make: testCarMakes.find(f => f.name == "Ford"), year: 2024 } as ICarModel,
    { _id: new mongooseTypes.ObjectId(), name: 'Corolla', make: testCarMakes.find(f => f.name == "Toyota"), year: 2019 } as ICarModel,
    { _id: new mongooseTypes.ObjectId(), name: 'Model 3', make: testCarMakes.find(f => f.name == "Tesla"), year: 20223 } as ICarModel
  ];


const testVehicles: IVehicle[] = [
  {
    _id: new mongooseTypes.ObjectId(),
    name: 'Ford F-150',
    model: test,
    make: 'Ford',
    year: '2021',
    vin: '1FTEW1EP1MFA00001',
    licNumber: 'ABC1234',
    mileage: 45230,
    bodyStyle: 'Truck',
    engineType: 'V6',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    features: ['Backup Camera', 'Bluetooth', 'Cruise Control'],
    price: 38995.00
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: 'Toyota Corolla',
    model: 'LE',
    make: 'Toyota',
    year: '2019',
    vin: '2T1BURHE5KC123456',
    licNumber: 'XYZ5678',
    mileage: 32100,
    bodyStyle: 'Sedan',
    engineType: 'I4',
    transmission: 'CVT',
    fuelType: 'Gasoline',
    features: ['Heated Seats', 'Keyless Entry'],
    price: 17995.00
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: 'Tesla Model 3',
    model: 'Long Range',
    make: 'Tesla',
    year: '2022',
    vin: '5YJ3E1EB5MF123456',
    licNumber: 'EV2022',
    mileage: 9800,
    bodyStyle: 'Sedan',
    engineType: 'Electric',
    transmission: 'Automatic',
    fuelType: 'Electric',
    features: ['Autopilot', 'Navigation System', 'Bluetooth'],
    price: 52999.00
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: 'Honda Civic',
    model: 'EX',
    make: 'Honda',
    year: '2018',
    vin: '19XFC2F79JE000001',
    licNumber: 'CIVIC18',
    mileage: 64000,
    bodyStyle: 'Coupe',
    engineType: 'I4',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    features: ['Sunroof', 'Backup Camera'],
    price: 15495.00
  },
  {
    _id: new mongooseTypes.ObjectId(),
    name: 'Chevrolet Tahoe',
    model: 'LT',
    make: 'Chevrolet',
    year: '2020',
    vin: '1GNSKBKC3LR123456',
    licNumber: 'SUV2020',
    mileage: 27850,
    bodyStyle: 'SUV',
    engineType: 'V8',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    features: ['3rd Row Seating', 'Heated Seats', 'Bluetooth'],
    price: 48950.00
  }
];
@Injectable({
    providedIn: 'root' // Makes this service a singleton throughout the app
  })
class MockCardadAPI {
    // Generic delay for mock responses
    private delay<T>(data: T): Observable<T> {
        return timer(750).pipe(switchMap(() => of(data)));
    }

    // JobModel Operations
    getJobs(page: number, pageSize: number, filter?: string): Observable<ApiResponse<IJob[]>> {
        const response = new ApiResponse<IJob[]>();
        response.data = [...testJobs];
        return this.delay(response);
    }

    createJob(job: IJob): Observable<ApiResponse<IJob>> {
        job._id = guidv4();
        testJobs.push(job);
        const response = new ApiResponse<IJob>();
        response.data = job;
        return this.delay(response);
    }

    updateJob(jobId: string, updatedJob: Partial<IJob>): Observable<ApiResponse<IJob>> {
        const job = testJobs.find(j => j._id === jobId);
        if (job) Object.assign(job, updatedJob);
        const response = new ApiResponse<IJob>();
        response.data = job || undefined;
        return this.delay(response);
    }

    deleteJob(jobId: string): Observable<ApiResponse<null>> {
        const index = testJobs.findIndex(j => j._id === jobId);
        if (index !== -1) testJobs.splice(index, 1);
        const response = new ApiResponse<null>();
        response.data = null;
        return this.delay(response);
    }

    // UserModel Operations
    getUsers(filter: string, page: number, pageSize: number): Observable<ApiResponse<IUser[]>> {
        const response = new ApiResponse<IUser[]>();
        response.data = [testUser];
        return this.delay(response);
    }

    getMe(): Observable<ApiResponse<IUser>> {
        const response = new ApiResponse<IUser>();
        response.data = testUser;
        return this.delay(response);
    }

    // VehicleModel Operations
    getVehicles(): Observable<ApiResponse<IVehicle[]>> {
        const response = new ApiResponse<IVehicle[]>();
        response.data = [testVehicle];
        return this.delay(response);
    }

    createVehicle(vehicle: IVehicle): Observable<ApiResponse<IVehicle>> {
        vehicle._id = guidv4();
        const newVehicle = vehicle;
        const response = new ApiResponse<IVehicle>();
        response.data = newVehicle || undefined;
        return this.delay(response);
    }

    // ShopModel Operations
    getShops(): Observable<ApiResponse<IShop[]>> {
        const response = new ApiResponse<IShop[]>();
        response.data = testShops;
        return this.delay(response);
    }

    // TechnicianModel Operations
    getTechnicians(): Observable<ApiResponse<ITechnician[]>> {
        const response = new ApiResponse<ITechnician[]>();
        response.data = testTechnicians;
        return this.delay(response);
    }
}

class ApiResponse<T> {
    errors?: [{ message: string, severity: number }];
    data?: T;
}

export default MockCardadAPI;