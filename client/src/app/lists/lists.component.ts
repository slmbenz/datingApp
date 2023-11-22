import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
  members: Member[] | undefined;
  predicate = 'liked';
  pageNumber = 1;
  poageSize = 5;
  pagination: Pagination | undefined;

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {}

  loadLikes() {
    this.memberService
      .getLikes(this.predicate, this.pageNumber, this.poageSize)
      .subscribe({
        next: (response) => {
          this.members = response.result;
          this.pagination = response.pagination;
        },
      });
  }

  pageChanged(event: any) {
    // if the page number is the same, don't do anything (prevent multiple calls to the API)
    if (this.pageNumber === event.page) return;
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
