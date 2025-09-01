import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Member } from 'src/app/core/models/Member';
import { MemberService } from 'src/app/core/services/MemberService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-members',
  templateUrl: './list-members.component.html',
  styleUrls: ['./list-members.component.css']
})
export class ListMembersComponent implements OnInit {
  Members: Member[] = [];
  filteredMembers: Member[] = [];
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100, 200, 1000];
  isSpinner = true;
  totalCount = 0;
  isAddMember = false;
  selectedMember?: Member;
  selectedMemberId = 0;
  LastIDCard = "";
  memberSubscriptionStatus: Map<number, boolean> = new Map();
  IsviewSubscriptionHistory = false;
  HistoryMember: Member = new Member();
  searchTerm = "";
  searchTimeout: any;
  language: string = "en"
  constructor(private memberService: MemberService, private toaster: ToastrService, private translate: TranslateService) {
    if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }

  async ngOnInit() {
    await this.loadMembers();
  }

  async loadMembers() {
    try {
      this.isSpinner = true;
      const res: any = await lastValueFrom(
        this.memberService.getMembers(this.currentPage, this.pageSize)
      );

      if (res.State) {
        this.totalCount = res.Data[0];
        const totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = Math.max(1, Math.min(res.Data[1] || 1, totalPages));
        this.pageSize = res.Data[2];
        this.Members = res.Data[3];
        this.LastIDCard = res.Data[4];
        this.filteredMembers = [...this.Members]; // Initialize filtered members

        // Check subscription status for each member
        await this.checkMemberSubscriptions();
      }
    } catch (error) {
      console.error('Error loading Members', error);
      this.toaster.error('Failed to load Members');
    } finally {
      this.isSpinner = false;
    }
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredMembers = [...this.Members];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();

    this.filteredMembers = this.Members.filter(member =>
      member.Name?.toLowerCase().includes(searchLower) ||
      member.Phone?.toLowerCase().includes(searchLower) ||
      member.Email?.toLowerCase().includes(searchLower) ||
      member.IDCard?.toLowerCase().includes(searchLower) ||
      member.Id?.toString().includes(searchLower)
    );

  }



  async checkMemberSubscriptions() {
    for (const member of this.Members) {
      try {
        const res: any = await lastValueFrom(
          this.memberService.getActiveSubscription(member.Id)
        );
        this.memberSubscriptionStatus.set(member.Id, res.State && res.Data[0] !== "No active subscription found");
      } catch (error) {
        console.error(`Error checking subscription for member ${member.Id}`, error);
        this.memberSubscriptionStatus.set(member.Id, false);
      }
    }
  }

  hasActiveSubscription(memberId: number): boolean {
    return this.memberSubscriptionStatus.get(memberId) || false;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadMembers();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadMembers();
  }

  openAddMember(member?: Member) {
    this.selectedMember = member;
    this.isAddMember = true;
  }

  async closeAddMemberModal() {
    this.isAddMember = false;
    await this.loadMembers();
  }

  async deleteMember(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Member will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await lastValueFrom(this.memberService.deleteMember(id));
        await this.loadMembers();
        this.toaster.success('Member deleted successfully');
      } catch (error) {
        this.toaster.error('Failed to delete Member');
      }
    }
  }

  async freezeMember(member: Member) {
    try {
      // Get active subscription first
      const activeSubRes: any = await lastValueFrom(
        this.memberService.getActiveSubscription(member.Id)
      );

      if (activeSubRes.State && activeSubRes.Data[0] !== "No active subscription found") {
        const activeSubscription = activeSubRes.Data[0];

        const result = await Swal.fire({
          title: 'Freeze Subscription?',
          html: `Freeze <b>${member.Name}'s</b> subscription?<br>
                 Current end date: ${new Date(activeSubscription.EndDate).toLocaleDateString()}<br>
                 Freeze days available: ${activeSubscription.CanFreeze ? 'Yes' : 'No'}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, freeze it!',
          cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
          const freezeRes: any = await lastValueFrom(
            this.memberService.freezeSubscription(member.Id, activeSubscription.Id)
          );

          if (freezeRes.State) {
            this.toaster.success('Subscription frozen successfully');
            await this.loadMembers(); // Reload to update status
          } else {
            this.toaster.error(freezeRes.ErrorMessage || 'Failed to freeze subscription');
          }
        }
      } else {
        this.toaster.warning('No active subscription found for this member');
      }
    } catch (error) {
      console.error('Error freezing subscription', error);
      this.toaster.error('Failed to freeze subscription');
    }
  }

  viewSubscriptionHistory(member: Member) {
    this.HistoryMember = member;
    this.IsviewSubscriptionHistory = true;
  }

  CloseviewSubscriptionHistory() {
    this.IsviewSubscriptionHistory = false;
  }

  getShowingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalCount);
  }
}