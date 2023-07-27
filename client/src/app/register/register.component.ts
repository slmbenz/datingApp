import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from './../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComponent: any; // input property from Parent to Child
  @Output() cancelRegister = new EventEmitter(); // output property from child to parent
  model: any = {};

  // injection always happen in constructor
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancel(); // to close the register form
      },
      error: (error) => console.log({ error }),
    });
    console.log(this.model);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
