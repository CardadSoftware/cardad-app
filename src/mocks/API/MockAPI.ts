import { JobModel, UserModel } from 'cardad-db';
import {v4 as guidv4} from 'uuid'
import { Observable, of, switchMap, timer } from 'rxjs';

const testUser: UserModel = {
    _id: guidv4(),
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

const testJobs: JobModel[] = [
    { _id: guidv4(), jobName: "test1", customer: testUser, invoices: [{ pay: 200, _id: guidv4() }] },
    { _id: guidv4(), jobName: "test2", customer: testUser, invoices: [{ pay: 200, _id: guidv4() }] },
    { _id: guidv4(), jobName: "test3", customer: testUser, invoices: [{ pay: 200, _id: guidv4() }] },
    { _id: guidv4(), jobName: "test4", customer: testUser, invoices: [{ pay: 200, _id: guidv4() }] }];

class MockCardadAPI{
    getJobs(page: number, pageSize: number,filter?: string): Observable<ApiResponse<Array<JobModel>>>{
        const response = new ApiResponse<Array<JobModel>>;
        response.data = testJobs;
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