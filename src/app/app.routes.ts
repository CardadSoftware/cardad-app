import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyGarageComponent } from './components/garage/my-garage/my-garage.component';
import { PageRoutes } from './constants/routes';

export const routes: Routes = [
    { path: "", component: HomeComponent, title: "Home" },
    { path: PageRoutes.MyGarage, component: MyGarageComponent }
];
