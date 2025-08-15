import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly APIUrl = environment.backApiUrl + 'Users/';

  constructor(private http: HttpClient) { }

  /** GET: Get menus for a user */
  getUserMenus(userId: number) {
    return this.http.get(`${this.APIUrl}GetUserMenus/${userId}`);
  }
  /** GET: Get System menus */
  getSystemMenus() {
    return this.http.get(`${this.APIUrl}GetSystemMenus`);
  }
  /** GET: Get paginated users */
  getUsers(page: number = 1, pageSize: number = 20) {
    return this.http.get(`${this.APIUrl}GetUsers?page=${page}&pageSize=${pageSize}`);
  }

  /** POST: Add or update user */
  saveUser(user: any) {
    return this.http.post(`${this.APIUrl}SaveUser`, user);
  }
  saveUserMenus(data: any) {
    return this.http.post(`${this.APIUrl}SaveUserMenus`, data);
  }
  /** DELETE: Delete a user by Id */
  deleteUser(id: number) {
    return this.http.delete(`${this.APIUrl}DeleteUser/${id}`);
  }
}
