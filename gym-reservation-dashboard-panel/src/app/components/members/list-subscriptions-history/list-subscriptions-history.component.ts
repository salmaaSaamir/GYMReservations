import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Member } from 'src/app/core/models/Member';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/core/services/MemberService';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-list-subscriptions-history',
  templateUrl: './list-subscriptions-history.component.html',
  styleUrls: ['./list-subscriptions-history.component.css']
})
export class ListSubscriptionsHistoryComponent implements OnInit {
  @Input() member: Member = new Member();
  @Output() closeMemberHistoryModal = new EventEmitter();

  subscriptionHistory: any[] = [];
  isLoading: boolean = false;
  language: string = 'en';
  constructor(
    private memberService: MemberService,
    private toaster: ToastrService,
    private translate: TranslateService
  ) {
    if ("language" in localStorage) {
      this.language = localStorage.getItem("language") ?? "en";
      this.translate.use(this.language);
    } else {
      this.language = "en";
      this.translate.use("en");
    }
  }

  ngOnInit(): void {
    this.getData()
    $('#subscriptionHistoryModal').modal('show');
  }

  async getData(): Promise<void> {
    this.isLoading = true;

    try {
      const res: any = await lastValueFrom(
        this.memberService.getMemberSubscriptionHistory(this.member.Id)
      );

      if (res.State) {

        this.subscriptionHistory = res.Data[0] || [];
      } else {
        this.toaster.error('Failed to load subscription history');
        this.subscriptionHistory = [];
      }
    } catch (error) {
      console.error('Error loading subscription history', error);
      this.toaster.error('Failed to load subscription history');
      this.subscriptionHistory = [];
    } finally {
      this.isLoading = false;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'frozen':
        return 'badge bg-info';
      case 'expired':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  cancel(): void {
    $('#subscriptionHistoryModal').modal('hide');
    this.closeMemberHistoryModal.emit();
  }
}