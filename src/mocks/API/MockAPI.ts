import { JobModel, UserModel } from 'cardad-db';
import { Observable, of, switchMap, timer } from 'rxjs';

const testUser: UserModel = {
    username: "anthony.stoute",
    firstName: "Anthony",
    lastName: "Stoute",
    email: "athony.stoute@test.com",
    createDate: new Date,
    active: true,
    online: true,
    salt: "",
    hash: ""

};

const testJob: JobModel = {
    jobName: "test1", customer: testUser, invoices: undefined
};

class MockCardadAPI{
    getJobs(filter: string, page: number, pageSize: number): Observable<ApiResponse<Array<JobModel>>>{
        const response = new ApiResponse<Array<JobModel>>;
        response.data = [testJob];
        // wait 750 mill then emit
        return timer(750).pipe(switchMap(() => of(response) ));
    }

    getUsers(filter: string, page: number, pageSize: number): Observable<ApiResponse<Array<UserModel>>>{
        const response = new ApiResponse<Array<UserModel>>;
        response.data = [testUser];
        // wait 750 mill then emit
        return timer(750).pipe(switchMap(() => of(response) ));
    }

    getMe(): Observable<ApiResponse<UserModel>>{
        const response = new ApiResponse<UserModel>;
        response.data = testUser;
        // wait 750 mill then emit
        return timer(750).pipe(switchMap(() => of(response) ));
    }
}

class ApiResponse<T>{
    errors?: [{ message: String, severity: number }];
    data?: T;
}

export default MockCardadAPI;