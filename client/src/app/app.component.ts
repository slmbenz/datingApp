import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Dating app';
  users: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // initializing code
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (response) => (this.users = response),
      error: (error) => {
        console.log('big shit', error);
      },
      complete: () => {
        console.log('Request has completed');
      },
    });
  }
}
