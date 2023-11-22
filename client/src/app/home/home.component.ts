import { Component, OnInit } from '@angular/core';
import { AccountService } from './../_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users: any;

  constructor(public accountService: AccountService) {
    this.registerMode = !accountService.userIsLoggedIn();
  }

  ngOnInit(): void {
    this.accountService.userIsLoggedIn();
    console.log(this.accountService.userIsLoggedIn());
    this.registerMode = !this.accountService.userIsLoggedIn();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }
}
