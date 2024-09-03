import { Component } from '@angular/core';
import MockCardadAPI  from '../../../mocks/API/MockAPI'
import { UserModel } from 'cardad-db';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentUser?: UserModel;
  constructor(private cardadApi: MockCardadAPI) {
    
  }
  getMe(){
    return this.cardadApi.getMe().subscribe((resp) => {
      // if errors then log them
      if (resp.errors?.length) {
        console.log(resp.errors..reduce((prev, curr) => prev + ", " + curr.message, resp.errors[0].message ))
      }
      
    })
  }
}
