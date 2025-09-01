import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardService } from 'src/app/core/services/DashboardService';
import { DashboardData } from 'src/app/core/interfaces/DashboardData';
import { lastValueFrom } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    NgChartsModule,TranslateModule
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {

  // Chart data
  barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  pieChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  doughnutChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  radarChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  // Chart types
  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  pieChartType: ChartType = 'pie';
  doughnutChartType: ChartType = 'doughnut';
  radarChartType: ChartType = 'radar';

  // Chart options
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      }
    }
  };

  isLoading = true;
  error: string | null = null;

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      this.isLoading = true;
      this.error = null;
      
      const observable = this.dashboardService.getDashboardData();
      const res: DashboardData = await lastValueFrom(observable);
      
      if (res) {
        this.updateCharts(res);
      } else {
        this.error = this.translate.instant('NoDataReceived');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      this.error = this.translate.instant('FailedToLoadData');
    } finally {
      this.isLoading = false;
    }
  }

  private updateCharts(data: any): void {
    // Bar Chart - Subscription Counts
    this.barChartData = {
      labels: data.SubscriptionCounts?.Labels || [],
      datasets: [{
        data: data.SubscriptionCounts?.Data || [],
        label: this.translate.instant('ActiveSubscriptions'),
        backgroundColor: '#ec407a',
        borderColor: '#ad1457',
        borderWidth: 1
      }]
    };

    // Line Chart - Monthly Reservations
    this.lineChartData = {
      labels: data.ReservationStats?.Labels || [],
      datasets: [{
        data: data.ReservationStats?.Data || [],
        label: this.translate.instant('MonthlyReservations'),
        fill: false,
        tension: 0.4,
        borderColor: '#d81b60',
        backgroundColor: 'rgba(236, 64, 122, 0.2)',
        pointBackgroundColor: '#ec407a',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#d81b60'
      }]
    };

    // Pie Chart - Class Status
    this.pieChartData = {
      labels: [
        this.translate.instant('ActiveClasses'),
        this.translate.instant('CancelledClasses')
      ],
      datasets: [{
        data: [
          data.CancellationStats?.ActiveCount || 0,
          data.CancellationStats?.CancelledCount || 0
        ],
        backgroundColor: ['#f8bbd0', '#ec407a'],
        hoverBackgroundColor: ['#f48fb1', '#ad1457']
      }]
    };

    // Doughnut Chart - Totals
    const totalSubscriptions = data.SubscriptionCounts?.Data?.reduce((a: any, b: any) => a + b, 0) || 0;
    this.doughnutChartData = {
      labels: [
        this.translate.instant('TotalReservations'),
        this.translate.instant('ActiveMemberSubscriptions')
      ],
      datasets: [{
        data: [
          data.TotalReservations || 0,
          totalSubscriptions
        ],
        backgroundColor: [
          'rgba(248, 187, 208, 0.7)',
          'rgba(236, 64, 122, 0.7)'
        ],
        hoverBackgroundColor: [
          'rgba(248, 187, 208, 1)',
          'rgba(236, 64, 122, 1)'
        ]
      }]
    };

    // Radar Chart - Performance Metrics
    this.radarChartData = {
      labels: [
        this.translate.instant('TotalReservations'),
        this.translate.instant('ActiveClasses'),
        this.translate.instant('ActiveMembers')
      ],
      datasets: [{
        data: [
          data.RadarMetrics?.TotalReservations || 0,
          data.RadarMetrics?.ActiveClasses || 0,
          data.RadarMetrics?.ActiveMembers || 0
        ],
        label: this.translate.instant('PerformanceMetrics'),
        backgroundColor: 'rgba(236, 64, 122, 0.2)',
        borderColor: '#d81b60',
        pointBackgroundColor: '#ec407a',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ad1457'
      }]
    };
  }

  refreshData() {
    this.loadDashboardData();
  }
}
