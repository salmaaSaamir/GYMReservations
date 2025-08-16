import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/core/services/UsersService';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-add-user-menu',
  templateUrl: './add-user-menu.component.html',
  styleUrls: ['./add-user-menu.component.scss']
})
export class AddUserMenuComponent implements OnInit {
  @Input() userId: number = 0;
  @Output() menusSaved = new EventEmitter();

  systemMenus: any[] = [];
  selectedMenus: number[] = []; // Store just the IDs for selection
  userCurrentMenus: any[] = [];

  constructor(private userService: UserService, private toaster: ToastrService) { }

  async ngOnInit(): Promise<void> {
    $('#addUserMenuModal').modal('show');
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      // Load all available system menus
      const res: any = await lastValueFrom(this.userService.getSystemMenus());
      
      if (res.State) {
        this.systemMenus = res.Data[0];

        // Load user's current menus if userId is provided (edit case)
        if (this.userId) {
          const userRes: any = await lastValueFrom(this.userService.getUserMenus(this.userId));

          if (userRes.State ) {
            this.userCurrentMenus = userRes.Data[0];
            // Initialize selectedMenus with the user's current menu IDs
            this.selectedMenus = this.userCurrentMenus.map(menu => menu.Id);
          }
        }
      }
    } catch (err) {
      console.error('Error loading menus', err);
      this.toaster.error('Failed to load menus');
    }
  }

  async saveUserMenus(): Promise<void> {
    if (!this.userId) {
      this.toaster.warning('No user selected');
      return;
    }

    try {
      const payload = {
        userId: this.userId,
        menuIds: this.selectedMenus
      };

      const res: any = await lastValueFrom(this.userService.saveUserMenus(payload));
      
      if (res.State) {
        this.toaster.success("Menus saved successfully");
        this.cancel();
      } else {
        this.toaster.error(res.ErrorMessage || "Failed to save menus");
      }
    } catch (err) {
      console.error('Error saving menus', err);
      this.toaster.error('Error saving menus');
    }
  }

  cancel(): void {
    $('#addUserMenuModal').modal('hide');
    this.menusSaved.emit();
  }

  // Helper method to check if a menu is selected
  isMenuSelected(menuId: number): boolean {
    return this.selectedMenus.includes(menuId);
  }

  // Toggle menu selection
  toggleMenuSelection(menuId: number): void {
    const index = this.selectedMenus.indexOf(menuId);
    if (index === -1) {
      this.selectedMenus.push(menuId);
    } else {
      this.selectedMenus.splice(index, 1);
    }
  }

  // Get menu name by ID
getMenuName(menuId: number): string {
  const menu = this.systemMenus.find(m => m.Id === menuId);
  return menu ? menu.DisplayName : 'Unknown Menu';
}

// Remove a menu from selection
removeMenu(menuId: number): void {
  this.selectedMenus = this.selectedMenus.filter(id => id !== menuId);
}
}