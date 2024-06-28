import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { User } from 'src/app/_models/user';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { AdminService } from './../../_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> =
    new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member']; // normally this would be fetched from the server

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe({ next: (users) => (this.users = users) });
  }

  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles],
      },
    } as ModalOptions;

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;

        if (!this.arrayEquals(selectedRoles!, user.roles)) {
          this.adminService
            .updateUserRoles(user.username, selectedRoles!.join(','))
            .subscribe({
              next: roles => user.roles = roles,
            });
        }
      },
    });
  }

  private arrayEquals(arr1: string[], arr2: string[]): boolean {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }
}