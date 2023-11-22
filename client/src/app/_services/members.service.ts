import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Member } from './../_models/member';
import { PaginatedResult } from './../_models/pagination';
import { UserParams } from './../_models/userPrams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map(); // store the members in a map
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      },
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-')); // get the members from the cache
    console.log(this.memberCache);
    if (response) return of(response); // if we already have the members in the cache, return it
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge); // append the minAge to the params
    params = params.append('maxAge', userParams.maxAge); // append the maxAge to the params
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResults<Member[]>(
      this.baseUrl + 'users',
      params
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response); // set the members in the cache
        return response;
      })
    );
  }

  private getPaginatedResults<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber); // append the page number to the params
    params = params.append('pageSize', pageSize);

    return params;
  }

  getMember(username: string) {
    // get all the members from the cache
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username); // find the member with the username

    if (member) return of(member); // if we already have the member in the cache, return it
    console.log(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        // update the member in the array
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}); // {} is the body
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
