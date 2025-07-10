import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserNavbarComponent } from './components/navbars';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserNavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cardad';
}
