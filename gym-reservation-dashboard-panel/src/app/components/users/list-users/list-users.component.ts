import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/UsersService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {
  users: User[] = [];
  currentPage = 1;  // Always start with page 1
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100, 200, 1000];
  isSpinner = true;
  totalCount = 0;
  isAddUser = false;
  selectedUser?: User;
  isAddUserMenu = false;
  selectedUserId = 0;
  searchTerm: string = '';
  filteredUsers: User[] = [];
  language: string = "en"
  constructor(private userService: UserService, private toaster: ToastrService, private translate: TranslateService) {
    if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  
}

  async ngOnInit() {
  await this.loadUsers();
}

  async loadUsers() {
  try {
    this.isSpinner = true;
    const res: any = await lastValueFrom(
      this.userService.getUsers(this.currentPage, this.pageSize)
    );

    if (res.State) {
      this.totalCount = res.Data[0];
      // Ensure currentPage is within valid range
      const totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
      this.pageSize = res.Data[2];
      this.users = res.Data[3];
      this.filteredUsers = [...this.users]; // Initialize filteredUsers
    }
  } catch (error) {
    console.error('Error loading users', error);
    this.toaster.error('Failed to load users');
  } finally {
    this.isSpinner = false;
  }
}

onPageChange(page: number) {
  this.currentPage = page;
  this.loadUsers();
}

onPageSizeChange() {
  this.currentPage = 1;
  this.loadUsers();
}

openAddUser(user ?: User) {
  this.selectedUser = user;
  this.isAddUser = true;
}

openAddUserMenu(Id: number) {
  this.selectedUserId = Id;
  this.isAddUserMenu = true;
}

  async closeAddUserModal() {
  this.isAddUser = false;
  await this.loadUsers();
}

closeAddUserMenuModal() {
  this.isAddUserMenu = false;
}

  async deleteUser(id: number) {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This user will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      await lastValueFrom(this.userService.deleteUser(id));
      await this.loadUsers();
      this.toaster.success('User deleted successfully');
    } catch (error) {
      this.toaster.error('Failed to delete user');
    }
  }
}
// In your component class
getShowingTo(): number {
  return Math.min(this.currentPage * this.pageSize, this.totalCount);
}
onSearch() {
  if (!this.searchTerm.trim()) {
    this.filteredUsers = [...this.users]; // لو مفيش كتابة رجّع كل اليوزرز
    return;
  }

  const searchLower = this.searchTerm.toLowerCase().trim();

  this.filteredUsers = this.users.filter(u =>
    u.FName?.toLowerCase().includes(searchLower) ||
    u.LName?.toLowerCase().includes(searchLower) ||
    u.Email?.toLowerCase().includes(searchLower) ||
    u.Id?.toString().includes(searchLower)
  );
}

}